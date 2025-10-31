const Notification = require('../models/Notification');
const Employee = require('../models/Employee');
const User = require('../models/User');
const pusherService = require('./pusher.service');

/**
 * Create a notification for a user
 * @param {Object} data - Notification data
 * @param {number} data.userId - User ID to notify
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.description - Notification description
 * @param {number} data.relatedId - Related entity ID
 * @param {string} data.relatedType - Related entity type
 * @param {string} data.actionUrl - URL to navigate when clicked
 */
async function createNotification(data) {
  try {
    const notification = await Notification.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      description: data.description,
      relatedId: data.relatedId,
      relatedType: data.relatedType,
      actionUrl: data.actionUrl,
      isRead: false,
    });

    console.log('✅ Notification created:', notification.id, 'for user:', data.userId);

    // Send real-time notification via Pusher
    try {
      await pusherService.sendNotification(data.userId, {
        id: notification.id,
        type: data.type,
        title: data.title,
        description: data.description,
        actionUrl: data.actionUrl,
        createdAt: notification.createdAt,
      });
      console.log('✅ Pusher notification sent to user:', data.userId);
    } catch (pusherError) {
      console.error('⚠️  Pusher notification failed (notification still created):', pusherError.message);
    }

    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw error;
  }
}

/**
 * Create notification for contract sent to employee
 */
async function notifyContractSent(contractInstance) {
  try {
    // Find the employee's user account by email
    const user = await User.findOne({
      where: { email: contractInstance.recipientEmail },
    });

    if (!user) {
      console.log('⚠️  No user found for email:', contractInstance.recipientEmail);
      return null;
    }

    return await createNotification({
      userId: user.id,
      type: 'contract_sent',
      title: 'New Contract Awaiting Signature',
      description: `You have received "${contractInstance.title}" for e-signature. Please review and sign by ${new Date(contractInstance.expiresAt).toLocaleDateString()}.`,
      relatedId: contractInstance.id,
      relatedType: 'contract',
      actionUrl: `/dashboard/contracts/sign/${contractInstance.id}`,
    });
  } catch (error) {
    console.error('❌ Error notifying contract sent:', error);
    return null;
  }
}

/**
 * Create notification when contract is signed
 */
async function notifyContractSigned(contractInstance, signedByUserId) {
  try {
    // Notify HR/Admin about signed contract
    // Find all HR and Admin users
    const hrAdminUsers = await User.findAll({
      include: [{
        model: require('../models/UserRole'),
        as: 'role',
        where: {
          slug: ['super_admin', 'hr_manager', 'hr'],
        },
      }],
    });

    const notifications = [];
    for (const user of hrAdminUsers) {
      const notification = await createNotification({
        userId: user.id,
        type: 'contract_signed',
        title: 'Contract Signed',
        description: `${contractInstance.recipientName} has signed "${contractInstance.title}".`,
        relatedId: contractInstance.id,
        relatedType: 'contract',
        actionUrl: `/dashboard/contracts/agreements`,
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('❌ Error notifying contract signed:', error);
    return [];
  }
}

/**
 * Create notification when contract is declined
 */
async function notifyContractDeclined(contractInstance) {
  try {
    // Notify HR/Admin about declined contract
    const hrAdminUsers = await User.findAll({
      include: [{
        model: require('../models/UserRole'),
        as: 'role',
        where: {
          slug: ['super_admin', 'hr_manager', 'hr'],
        },
      }],
    });

    const notifications = [];
    for (const user of hrAdminUsers) {
      const notification = await createNotification({
        userId: user.id,
        type: 'contract_declined',
        title: 'Contract Declined',
        description: `${contractInstance.recipientName} has declined "${contractInstance.title}". Reason: ${contractInstance.declineReason}`,
        relatedId: contractInstance.id,
        relatedType: 'contract',
        actionUrl: `/dashboard/contracts/agreements`,
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('❌ Error notifying contract declined:', error);
    return [];
  }
}

module.exports = {
  createNotification,
  notifyContractSent,
  notifyContractSigned,
  notifyContractDeclined,
};

