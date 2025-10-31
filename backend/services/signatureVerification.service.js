/**
 * Signature Verification Service
 * Implements tamper detection, hash verification, and digital signature validation
 * Compliant with ESIGN Act, UETA, and eIDAS requirements
 */

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate SHA-256 hash of document
 * @param {Buffer|string} data - Document buffer or file path
 * @returns {string} SHA-256 hash
 */
async function generateDocumentHash(data) {
  try {
    let buffer;
    
    if (typeof data === 'string') {
      // If it's a file path, read the file
      buffer = await fs.readFile(data);
    } else {
      buffer = data;
    }
    
    const hash = crypto
      .createHash('sha256')
      .update(buffer)
      .digest('hex');
    
    return hash;
  } catch (error) {
    console.error('❌ Error generating document hash:', error);
    throw error;
  }
}

/**
 * Generate hash of signature data
 * @param {string} signatureDataUrl - Base64 encoded signature
 * @returns {string} SHA-256 hash
 */
function generateSignatureHash(signatureDataUrl) {
  return crypto
    .createHash('sha256')
    .update(signatureDataUrl)
    .digest('hex');
}

/**
 * Verify document integrity by comparing hashes
 * @param {string} documentPath - Path to document file
 * @param {string} expectedHash - Expected SHA-256 hash
 * @returns {Object} Verification result
 */
async function verifyDocumentIntegrity(documentPath, expectedHash) {
  try {
    const currentHash = await generateDocumentHash(documentPath);
    
    const result = {
      valid: currentHash === expectedHash,
      tampered: currentHash !== expectedHash,
      expectedHash,
      currentHash,
      verifiedAt: new Date(),
    };
    
    if (result.tampered) {
      console.error('⚠️  TAMPER DETECTED:', {
        expected: expectedHash,
        current: currentHash,
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error verifying document integrity:', error);
    return {
      valid: false,
      tampered: false,
      error: error.message,
      verifiedAt: new Date(),
    };
  }
}

/**
 * Create tamper-evident seal for document
 * Combines document hash + all signature hashes + timestamp
 * @param {Object} data
 * @returns {string} Composite hash seal
 */
function createTamperEvidentSeal(data) {
  const {
    documentHash,
    signatureHashes = [],
    timestamp,
    contractNumber,
  } = data;
  
  const sealData = JSON.stringify({
    documentHash,
    signatureHashes: signatureHashes.sort(), // Sort for consistency
    timestamp: timestamp.toISOString(),
    contractNumber,
  });
  
  const seal = crypto
    .createHash('sha256')
    .update(sealData)
    .digest('hex');
  
  return seal;
}

/**
 * Verify tamper-evident seal
 * @param {Object} data
 * @param {string} expectedSeal
 * @returns {boolean}
 */
function verifyTamperEvidentSeal(data, expectedSeal) {
  const currentSeal = createTamperEvidentSeal(data);
  return currentSeal === expectedSeal;
}

/**
 * Generate public verification code for document
 * Can be shared publicly to verify document authenticity
 * @param {Object} contractData
 * @returns {string} Verification code
 */
function generateVerificationCode(contractData) {
  const {
    contractNumber,
    documentHash,
    signedAt,
  } = contractData;
  
  const verificationString = `${contractNumber}:${documentHash}:${signedAt.getTime()}`;
  const code = crypto
    .createHash('sha256')
    .update(verificationString)
    .digest('hex')
    .substring(0, 16)
    .toUpperCase();
  
  // Format as XXXX-XXXX-XXXX-XXXX
  return code.match(/.{1,4}/g).join('-');
}

/**
 * Verify document using public verification code
 * @param {string} verificationCode
 * @param {Object} contractData
 * @returns {boolean}
 */
function verifyWithCode(verificationCode, contractData) {
  const expectedCode = generateVerificationCode(contractData);
  const cleanCode = verificationCode.replace(/-/g, '');
  const cleanExpected = expectedCode.replace(/-/g, '');
  
  return cleanCode === cleanExpected;
}

/**
 * Generate device fingerprint from user agent
 * @param {string} userAgent
 * @param {string} acceptLanguage
 * @param {string} screenResolution
 * @returns {string} Device fingerprint hash
 */
function generateDeviceFingerprint(userAgent, acceptLanguage = '', screenResolution = '') {
  const fingerprintData = `${userAgent}|${acceptLanguage}|${screenResolution}`;
  return crypto
    .createHash('sha256')
    .update(fingerprintData)
    .digest('hex')
    .substring(0, 32);
}

/**
 * Validate signature data integrity
 * @param {string} signatureDataUrl - Base64 signature
 * @param {string} expectedHash - Expected hash
 * @returns {boolean}
 */
function validateSignatureIntegrity(signatureDataUrl, expectedHash) {
  const currentHash = generateSignatureHash(signatureDataUrl);
  return currentHash === expectedHash;
}

/**
 * Create comprehensive verification report
 * @param {Object} contractInstance
 * @param {Array} signers
 * @returns {Object} Verification report
 */
async function createVerificationReport(contractInstance, signers) {
  const report = {
    contractNumber: contractInstance.contractNumber,
    verifiedAt: new Date(),
    overallStatus: 'valid',
    checks: [],
  };
  
  // Check 1: Document Integrity
  if (contractInstance.signedFilePath && contractInstance.signed_document_hash) {
    const integrityCheck = await verifyDocumentIntegrity(
      contractInstance.signedFilePath,
      contractInstance.signed_document_hash
    );
    report.checks.push({
      checkType: 'document_integrity',
      passed: integrityCheck.valid,
      details: integrityCheck,
    });
    if (!integrityCheck.valid) report.overallStatus = 'invalid';
  }
  
  // Check 2: Signature Hashes
  for (const signer of signers) {
    if (signer.signature_data && signer.signature_hash) {
      const signatureValid = validateSignatureIntegrity(
        signer.signature_data,
        signer.signature_hash
      );
      report.checks.push({
        checkType: 'signature_integrity',
        signer: signer.full_name,
        passed: signatureValid,
      });
      if (!signatureValid) report.overallStatus = 'invalid';
    }
  }
  
  // Check 3: Signing Order (if sequential)
  if (contractInstance.requires_sequential_signing) {
    const orderedSigners = signers.sort((a, b) => a.signer_order - b.signer_order);
    let orderValid = true;
    
    for (let i = 0; i < orderedSigners.length - 1; i++) {
      const current = orderedSigners[i];
      const next = orderedSigners[i + 1];
      
      if (current.signed_at && next.signed_at) {
        if (new Date(next.signed_at) < new Date(current.signed_at)) {
          orderValid = false;
          break;
        }
      }
    }
    
    report.checks.push({
      checkType: 'signing_order',
      passed: orderValid,
    });
    if (!orderValid) report.overallStatus = 'invalid';
  }
  
  // Check 4: All Required Signers
  const allSigned = signers.every(s => s.status === 'signed');
  report.checks.push({
    checkType: 'all_signers_completed',
    passed: allSigned,
    totalSigners: signers.length,
    signed: signers.filter(s => s.status === 'signed').length,
  });
  
  report.summary = {
    totalChecks: report.checks.length,
    passed: report.checks.filter(c => c.passed).length,
    failed: report.checks.filter(c => !c.passed).length,
  };
  
  return report;
}

module.exports = {
  generateDocumentHash,
  generateSignatureHash,
  verifyDocumentIntegrity,
  createTamperEvidentSeal,
  verifyTamperEvidentSeal,
  generateVerificationCode,
  verifyWithCode,
  generateDeviceFingerprint,
  validateSignatureIntegrity,
  createVerificationReport,
};
EOFSCRIPT
cat apply_esign_schema.js && node apply_esign_schema.js
