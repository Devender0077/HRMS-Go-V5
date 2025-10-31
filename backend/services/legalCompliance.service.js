/**
 * Legal Compliance Service
 * Implements ESIGN Act, UETA, and eIDAS requirements
 * Captures all required metadata for legally binding e-signatures
 */

const geoip = require('geoip-lite');

/**
 * Capture ESIGN Act consent
 * Required: User must explicitly consent to use electronic signatures
 * @param {Object} data
 * @returns {Object} Consent record
 */
function captureESIGNConsent(data) {
  const {
    userId,
    email,
    contractId,
    ipAddress,
    userAgent,
  } = data;
  
  return {
    userId,
    email,
    contractId,
    consentGiven: true,
    consentTimestamp: new Date(),
    consentText: "I consent to use electronic signatures and electronic records for this transaction. " +
                 "I understand that my electronic signature will be legally binding and have the same effect as a handwritten signature.",
    consentMethod: 'explicit_checkbox',
    ipAddress,
    userAgent,
    geolocation: getGeolocation(ipAddress),
    complianceStandards: ['ESIGN Act (US)', 'UETA', 'eIDAS (EU)'],
  };
}

/**
 * Capture intent to sign
 * Required: Must prove signer intended to execute the signature
 * @param {Object} data
 * @returns {Object} Intent record
 */
function captureSigningIntent(data) {
  const {
    signerId,
    contractId,
    action, // 'click_sign_button', 'draw_signature', 'type_signature', 'upload_signature'
    ipAddress,
  } = data;
  
  return {
    signerId,
    contractId,
    intentGiven: true,
    intentTimestamp: new Date(),
    intentAction: action,
    explicit: true, // User explicitly clicked/drew/typed
    witnessed: true, // System witnessed the action
    ipAddress,
    actionDescription: getActionDescription(action),
  };
}

/**
 * Get human-readable action description
 */
function getActionDescription(action) {
  const descriptions = {
    click_sign_button: 'User clicked "Sign & Complete" button',
    draw_signature: 'User drew signature on canvas',
    type_signature: 'User typed signature with selected font',
    upload_signature: 'User uploaded signature image file',
    accept_terms: 'User checked "I agree to terms" checkbox',
  };
  return descriptions[action] || action;
}

/**
 * Get geolocation from IP address
 * @param {string} ipAddress
 * @returns {Object} Location data
 */
function getGeolocation(ipAddress) {
  try {
    // Skip localhost
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress.startsWith('::ffff:127')) {
      return {
        city: 'Local Development',
        region: 'Local',
        country: 'Local',
        coordinates: null,
      };
    }
    
    const geo = geoip.lookup(ipAddress);
    
    if (geo) {
      return {
        city: geo.city || 'Unknown',
        region: geo.region || 'Unknown',
        country: geo.country || 'Unknown',
        coordinates: geo.ll ? `${geo.ll[0]}, ${geo.ll[1]}` : null,
        timezone: geo.timezone || null,
      };
    }
    
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      coordinates: null,
    };
  } catch (error) {
    console.error('Error getting geolocation:', error);
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      coordinates: null,
    };
  }
}

/**
 * Generate browser fingerprint
 * Combines user agent, accept headers, and other browser data
 * @param {Object} req - Express request object
 * @returns {Object} Browser fingerprint
 */
function generateBrowserFingerprint(req) {
  const fingerprint = {
    userAgent: req.headers['user-agent'] || '',
    acceptLanguage: req.headers['accept-language'] || '',
    acceptEncoding: req.headers['accept-encoding'] || '',
    platform: getPlatformFromUserAgent(req.headers['user-agent']),
    browser: getBrowserFromUserAgent(req.headers['user-agent']),
    timestamp: new Date(),
  };
  
  // Generate hash of fingerprint
  const fingerprintHash = require('crypto')
    .createHash('sha256')
    .update(JSON.stringify(fingerprint))
    .digest('hex');
  
  return {
    ...fingerprint,
    fingerprintHash,
  };
}

/**
 * Extract platform from user agent
 */
function getPlatformFromUserAgent(userAgent = '') {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}

/**
 * Extract browser from user agent
 */
function getBrowserFromUserAgent(userAgent = '') {
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
  return 'Unknown';
}

/**
 * Create ESIGN compliance record
 * Complete record for legal validity
 * @param {Object} signingData
 * @returns {Object} Compliance record
 */
function createESIGNComplianceRecord(signingData) {
  const {
    signer,
    contract,
    signature,
    request,
  } = signingData;
  
  return {
    // ESIGN Requirement 1: Intent to Sign
    intent: {
      given: true,
      timestamp: new Date(),
      method: signature.method, // draw, type, upload
      explicitAction: true,
    },
    
    // ESIGN Requirement 2: Consent to Electronic Records
    consent: {
      given: true,
      timestamp: signer.consent_timestamp,
      text: signer.consent_text,
      method: 'checkbox',
      ipAddress: signer.consent_ip,
    },
    
    // ESIGN Requirement 3: Association of Signature with Record
    association: {
      documentId: contract.id,
      documentHash: contract.document_hash,
      signatureHash: signature.hash,
      linkage: 'cryptographic', // Linked via hashing
      timestamp: signature.timestamp,
    },
    
    // ESIGN Requirement 4: Attribution (Identity of Signer)
    attribution: {
      signerName: signer.full_name,
      signerEmail: signer.email,
      userId: signer.user_id,
      authenticated: signer.authentication_verified,
      authMethod: signer.authentication_method,
    },
    
    // ESIGN Requirement 5: Record Retention
    retention: {
      stored: true,
      storagePath: contract.signedFilePath,
      retentionPeriod: contract.retention_period || '7 years',
      archivePolicy: 'secure_encrypted_storage',
      retrievable: true,
    },
    
    // ESIGN Requirement 6: Audit Trail
    audit: {
      documentCreated: contract.created_at,
      sentToSigner: signer.sent_at,
      viewed: signer.viewed_at,
      signed: signer.signed_at,
      ipAddress: signer.ip_address,
      geolocation: signer.geo_location,
      deviceFingerprint: signer.device_fingerprint,
    },
    
    // ESIGN Requirement 7: Tamper Evidence
    tamperEvidence: {
      originalHash: contract.document_hash,
      finalHash: contract.signed_document_hash,
      hashingAlgorithm: 'SHA-256',
      tamperProof: true,
    },
    
    // Additional Metadata
    compliance: {
      standards: ['ESIGN Act (US)', 'UETA', 'eIDAS (EU)'],
      region: contract.compliance_region || 'GLOBAL',
      legallyBinding: contract.legally_binding,
      certificateIssued: contract.certificate_issued,
    },
  };
}

/**
 * Validate ESIGN compliance before allowing signature
 * @param {Object} signer
 * @returns {Object} Validation result
 */
function validateESIGNCompliance(signer) {
  const errors = [];
  
  // Must have consent
  if (!signer.consent_given || !signer.consent_timestamp) {
    errors.push('ESIGN_CONSENT_MISSING: Signer must consent to electronic signatures');
  }
  
  // Must have authentication
  if (!signer.authentication_verified) {
    errors.push('AUTHENTICATION_REQUIRED: Signer identity must be verified');
  }
  
  // Must capture IP and user agent
  if (!signer.ip_address) {
    errors.push('IP_ADDRESS_MISSING: IP address required for audit trail');
  }
  
  if (!signer.user_agent) {
    errors.push('USER_AGENT_MISSING: Browser information required for audit trail');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    complianceLevel: errors.length === 0 ? 'fully_compliant' : 'non_compliant',
  };
}

module.exports = {
  captureESIGNConsent,
  captureSigningIntent,
  getGeolocation,
  generateBrowserFingerprint,
  createESIGNComplianceRecord,
  validateESIGNCompliance,
  getPlatformFromUserAgent,
  getBrowserFromUserAgent,
};

