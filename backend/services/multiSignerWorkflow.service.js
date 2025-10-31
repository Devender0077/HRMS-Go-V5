/**
 * Multi-Signer Workflow Service
 * Manages complex signing workflows with multiple signers in sequence or parallel
 * Handles signer order, status tracking, notifications, and reminders
 */

const ContractSigner = require('../models/ContractSigner');
const notificationService = require('./notification.service');
const { Op } = require('sequelize');

/**
 * Create signers for a contract
 * @param {Object} data
 * @param {number} data.contractInstanceId
 * @param {Array} data.signers - Array of signer objects
 * @param {boolean} data.sequentialSigning - If true, signers must sign in order
 * @returns {Array} Created signer records
 */
async function createSigners(data) {
  const {
    contractInstanceId,
    signers,
    sequentialSigning = false,
  } = data;
  
  const createdSigners = [];
  
  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];
    
    const signerRecord = await ContractSigner.create({
      contractInstanceId,
      signerType: signer.type || 'employee',
      signerOrder: signer.order || (i + 1),
      userId: signer.userId || null,
      email: signer.email,
      fullName: signer.fullName,
      phone: signer.phone || null,
      status: i === 0 || !sequentialSigning ? 'pending' : 'awaiting_turn',
    });
    
    createdSigners.push(signerRecord);
  }
  
  console.log(`✅ Created ${createdSigners.length} signers for contract ${contractInstanceId}`);
  
  // Send notification to first signer (or all if parallel)
  if (sequentialSigning) {
    await sendSigningInvitation(createdSigners[0]);
  } else {
    for (const signer of createdSigners) {
      await sendSigningInvitation(signer);
    }
  }
  
  return createdSigners;
}

/**
 * Send signing invitation to a signer
 * @param {Object} signer - Signer record
 */
async function sendSigningInvitation(signer) {
  try {
    // Update status to 'sent'
    signer.status = 'sent';
    signer.sentAt = new Date();
    await signer.save();
    
    // Generate secure access code
    const accessCode = generateAccessCode();
    signer.accessCode = accessCode;
    signer.accessCodeExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await signer.save();
    
    // Send notification
    if (signer.userId) {
      await notificationService.createNotification({
        userId: signer.userId,
        type: 'contract_sent',
        title: 'Document Awaiting Your Signature',
        description: `You are requested to sign a document. Please review and sign by the deadline.`,
        relatedId: signer.contractInstanceId,
        relatedType: 'contract',
        actionUrl: `/dashboard/contracts/sign/${signer.contractInstanceId}?signer=${signer.id}&code=${accessCode}`,
      });
    }
    
    // TODO: Send email as well
    console.log(`✅ Sent signing invitation to ${signer.email}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending signing invitation:', error);
    return false;
  }
}

/**
 * Generate secure access code for signing link
 * @returns {string} 16-character alphanumeric code
 */
function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Process signer signature completion
 * Handles signing order, notifications to next signer, etc.
 * @param {Object} data
 * @returns {Object} Result
 */
async function processSignerCompletion(data) {
  const {
    signerId,
    signatureData,
    signatureHash,
    signatureMethod,
    ipAddress,
    userAgent,
    geolocation,
  } = data;
  
  try {
    const signer = await ContractSigner.findByPk(signerId);
    
    if (!signer) {
      throw new Error('Signer not found');
    }
    
    // Update signer record
    signer.status = 'signed';
    signer.signedAt = new Date();
    signer.signatureData = signatureData;
    signer.signatureHash = signatureHash;
    signer.signatureMethod = signatureMethod;
    signer.ipAddress = ipAddress;
    signer.userAgent = userAgent;
    signer.geoLocation = geolocation;
    await signer.save();
    
    console.log(`✅ Signer ${signer.email} completed signing`);
    
    // Check if this is sequential signing
    const contractInstance = await signer.getContractInstance();
    
    if (contractInstance.requiresSequentialSigning) {
      // Find next signer in sequence
      const nextSigner = await ContractSigner.findOne({
        where: {
          contractInstanceId: signer.contractInstanceId,
          signerOrder: signer.signerOrder + 1,
          status: 'awaiting_turn',
        },
      });
      
      if (nextSigner) {
        // Send invitation to next signer
        await sendSigningInvitation(nextSigner);
        console.log(`✅ Sent invitation to next signer: ${nextSigner.email}`);
      }
    }
    
    // Check if all signers have completed
    const allSigners = await ContractSigner.findAll({
      where: { contractInstanceId: signer.contractInstanceId },
    });
    
    const allSigned = allSigners.every(s => s.status === 'signed');
    
    if (allSigned) {
      // All signers completed - mark contract as fully signed
      contractInstance.lifecycleState = 'fully_signed';
      contractInstance.status = 'completed';
      await contractInstance.save();
      
      console.log(`✅ All signers completed! Contract ${contractInstance.contractNumber} is fully signed`);
      
      // Notify sender/HR that contract is complete
      await notifyContractFullySigned(contractInstance, allSigners);
    }
    
    return {
      success: true,
      allSignersCompleted: allSigned,
      nextSigner: allSigned ? null : await getNextPendingSigner(signer.contractInstanceId),
    };
  } catch (error) {
    console.error('❌ Error processing signer completion:', error);
    throw error;
  }
}

/**
 * Get next pending signer
 * @param {number} contractInstanceId
 * @returns {Object} Next signer or null
 */
async function getNextPendingSigner(contractInstanceId) {
  return await ContractSigner.findOne({
    where: {
      contractInstanceId,
      status: {
        [Op.in]: ['pending', 'sent', 'viewed', 'awaiting_turn'],
      },
    },
    order: [['signerOrder', 'ASC']],
  });
}

/**
 * Notify that contract is fully signed
 */
async function notifyContractFullySigned(contractInstance, signers) {
  // Notify the sender/HR
  const sender = signers.find(s => s.signerType === 'sender' || s.signerType === 'hr_manager');
  
  if (sender && sender.userId) {
    await notificationService.createNotification({
      userId: sender.userId,
      type: 'contract_signed',
      title: 'Document Fully Signed',
      description: `All ${signers.length} signer(s) have signed "${contractInstance.title}". The document is now complete.`,
      relatedId: contractInstance.id,
      relatedType: 'contract',
      actionUrl: `/dashboard/contracts/agreements/${contractInstance.id}`,
    });
  }
}

/**
 * Send reminder to pending signers
 * @param {number} contractInstanceId
 * @returns {number} Number of reminders sent
 */
async function sendReminders(contractInstanceId) {
  const pendingSigners = await ContractSigner.findAll({
    where: {
      contractInstanceId,
      status: {
        [Op.in]: ['sent', 'viewed'],
      },
    },
  });
  
  let remindersSent = 0;
  
  for (const signer of pendingSigners) {
    // Don't spam - max 3 reminders
    if (signer.reminderCount >= 3) {
      continue;
    }
    
    // Send notification
    if (signer.userId) {
      await notificationService.createNotification({
        userId: signer.userId,
        type: 'contract_sent',
        title: 'Reminder: Document Awaiting Signature',
        description: `This is a reminder that you have a pending document to sign. Please complete it soon.`,
        relatedId: contractInstanceId,
        relatedType: 'contract',
        actionUrl: `/dashboard/contracts/sign/${contractInstanceId}?signer=${signer.id}`,
      });
    }
    
    // TODO: Send email reminder as well
    
    signer.reminderCount += 1;
    signer.lastReminderSent = new Date();
    await signer.save();
    
    remindersSent++;
  }
  
  return remindersSent;
}

/**
 * Get signing progress for a contract
 * @param {number} contractInstanceId
 * @returns {Object} Progress data
 */
async function getSigningProgress(contractInstanceId) {
  const signers = await ContractSigner.findAll({
    where: { contractInstanceId },
    order: [['signerOrder', 'ASC']],
  });
  
  const total = signers.length;
  const signed = signers.filter(s => s.status === 'signed').length;
  const pending = signers.filter(s => s.status !== 'signed' && s.status !== 'declined').length;
  const declined = signers.filter(s => s.status === 'declined').length;
  
  return {
    total,
    signed,
    pending,
    declined,
    percentComplete: total > 0 ? Math.round((signed / total) * 100) : 0,
    currentSigner: signers.find(s => s.status === 'sent' || s.status === 'viewed'),
    nextSigner: await getNextPendingSigner(contractInstanceId),
    allSigners: signers.map(s => ({
      id: s.id,
      name: s.fullName,
      email: s.email,
      order: s.signerOrder,
      status: s.status,
      signedAt: s.signedAt,
    })),
  };
}

/**
 * Check if signer is allowed to sign now
 * (For sequential signing, must wait for previous signers)
 * @param {number} signerId
 * @returns {Object} Permission result
 */
async function checkSignerPermission(signerId) {
  const signer = await ContractSigner.findByPk(signerId);
  
  if (!signer) {
    return { allowed: false, reason: 'Signer not found' };
  }
  
  if (signer.status === 'signed') {
    return { allowed: false, reason: 'Already signed' };
  }
  
  if (signer.status === 'declined') {
    return { allowed: false, reason: 'Already declined' };
  }
  
  const contractInstance = await signer.getContractInstance();
  
  // Check if sequential signing is required
  if (!contractInstance.requiresSequentialSigning) {
    return { allowed: true, reason: 'Parallel signing allowed' };
  }
  
  // For sequential signing, check if all previous signers have signed
  const previousSigners = await ContractSigner.findAll({
    where: {
      contractInstanceId: signer.contractInstanceId,
      signerOrder: {
        [Op.lt]: signer.signerOrder,
      },
    },
  });
  
  const allPreviousSigned = previousSigners.every(s => s.status === 'signed');
  
  if (!allPreviousSigned) {
    const pendingPrevious = previousSigners.find(s => s.status !== 'signed');
    return {
      allowed: false,
      reason: 'Waiting for previous signers',
      waitingFor: pendingPrevious ? pendingPrevious.fullName : 'previous signer',
    };
  }
  
  return { allowed: true, reason: 'Your turn to sign' };
}

module.exports = {
  createSigners,
  sendSigningInvitation,
  processSignerCompletion,
  getNextPendingSigner,
  sendReminders,
  getSigningProgress,
  checkSignerPermission,
  generateAccessCode,
};

