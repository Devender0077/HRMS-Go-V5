const Pusher = require('pusher');
const IntegrationPusher = require('../models/IntegrationPusher');

let pusherInstance = null;

/**
 * Initialize Pusher with credentials from database
 */
async function initializePusher() {
  try {
    // Get Pusher configuration from database
    const config = await IntegrationPusher.findOne();
    
    if (!config || !config.isEnabled) {
      console.log('⚠️  Pusher is not enabled in database');
      return null;
    }

    if (!config.appId || !config.key || !config.secret || !config.cluster) {
      console.log('⚠️  Pusher configuration incomplete');
      return null;
    }

    pusherInstance = new Pusher({
      appId: config.appId,
      key: config.key,
      secret: config.secret,
      cluster: config.cluster,
      useTLS: true,
    });

    console.log('✅ Pusher initialized successfully');
    console.log(`   App ID: ${config.appId}`);
    console.log(`   Cluster: ${config.cluster}`);
    
    return pusherInstance;
  } catch (error) {
    console.error('❌ Failed to initialize Pusher:', error.message);
    return null;
  }
}

/**
 * Get Pusher instance (initialize if not already done)
 */
async function getPusher() {
  if (!pusherInstance) {
    await initializePusher();
  }
  return pusherInstance;
}

/**
 * Send notification via Pusher
 */
async function sendNotification(userId, notification) {
  try {
    const pusher = await getPusher();
    if (!pusher) {
      console.log('⚠️  Pusher not available, skipping real-time notification');
      return false;
    }

    const channelName = `private-user-${userId}`;
    const eventName = 'notification';

    await pusher.trigger(channelName, eventName, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      createdAt: notification.createdAt || new Date(),
    });

    console.log(`✅ Pusher notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send Pusher notification:', error.message);
    return false;
  }
}

/**
 * Broadcast announcement to all users
 */
async function broadcastAnnouncement(announcement) {
  try {
    const pusher = await getPusher();
    if (!pusher) {
      console.log('⚠️  Pusher not available, skipping broadcast');
      return false;
    }

    const channelName = 'announcement-channel';
    const eventName = 'new-announcement';

    await pusher.trigger(channelName, eventName, {
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      createdAt: announcement.createdAt || new Date(),
    });

    console.log('✅ Announcement broadcasted via Pusher');
    return true;
  } catch (error) {
    console.error('❌ Failed to broadcast announcement:', error.message);
    return false;
  }
}

/**
 * Send message via Pusher
 */
async function sendMessage(fromUserId, toUserId, message) {
  try {
    const pusher = await getPusher();
    if (!pusher) {
      console.log('⚠️  Pusher not available, skipping message');
      return false;
    }

    const channelName = `private-chat-${toUserId}`;
    const eventName = 'new-message';

    await pusher.trigger(channelName, eventName, {
      from: fromUserId,
      message: message,
      timestamp: new Date(),
    });

    console.log(`✅ Message sent from ${fromUserId} to ${toUserId}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send message:', error.message);
    return false;
  }
}

/**
 * Trigger custom event on a channel
 */
async function triggerEvent(channel, event, data) {
  try {
    const pusher = await getPusher();
    if (!pusher) {
      console.log('⚠️  Pusher not available');
      return false;
    }

    await pusher.trigger(channel, event, data);
    console.log(`✅ Event "${event}" triggered on channel "${channel}"`);
    return true;
  } catch (error) {
    console.error('❌ Failed to trigger event:', error.message);
    return false;
  }
}

module.exports = {
  initializePusher,
  getPusher,
  sendNotification,
  broadcastAnnouncement,
  sendMessage,
  triggerEvent,
};

