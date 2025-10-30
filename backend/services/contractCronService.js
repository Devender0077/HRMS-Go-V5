const cron = require('node-cron');
const ContractInstance = require('../models/ContractInstance');
const EmployeeOnboardingDocument = require('../models/EmployeeOnboardingDocument');
const contractEmailService = require('./contractEmailService');
const { Op } = require('sequelize');

/**
 * Contract Cron Service
 * Handles scheduled tasks for contract management
 */

class ContractCronService {
  constructor() {
    this.jobs = [];
  }

  /**
   * Start all cron jobs
   */
  start() {
    console.log('🕐 Starting contract management cron jobs...');

    // Job 1: Send reminders for pending contracts (runs daily at 9 AM)
    const reminderJob = cron.schedule('0 9 * * *', async () => {
      await this.sendPendingReminders();
    }, {
      scheduled: false,
    });

    // Job 2: Mark expired contracts (runs daily at midnight)
    const expiryJob = cron.schedule('0 0 * * *', async () => {
      await this.markExpiredContracts();
    }, {
      scheduled: false,
    });

    // Job 3: Check overdue onboarding documents (runs daily at 8 AM)
    const overdueJob = cron.schedule('0 8 * * *', async () => {
      await this.checkOverdueDocuments();
    }, {
      scheduled: false,
    });

    // Start all jobs
    reminderJob.start();
    expiryJob.start();
    overdueJob.start();

    this.jobs.push(reminderJob, expiryJob, overdueJob);

    console.log('✅ Contract cron jobs started');
    console.log('   - Reminder job: Daily at 9 AM');
    console.log('   - Expiry job: Daily at midnight');
    console.log('   - Overdue job: Daily at 8 AM');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    this.jobs.forEach(job => job.stop());
    console.log('⏹️ Contract cron jobs stopped');
  }

  /**
   * Send reminders for pending contracts
   */
  async sendPendingReminders() {
    try {
      console.log('📧 Checking for contracts needing reminders...');

      const now = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      // Find contracts that:
      // 1. Are in pending status (sent, viewed, in_progress)
      // 2. Haven't been completed
      // 3. Were sent more than 3 days ago OR expiring in 1 day
      const contractsForReminder = await ContractInstance.findAll({
        where: {
          status: { [Op.in]: ['sent', 'viewed', 'in_progress'] },
          [Op.or]: [
            // Sent 3+ days ago
            {
              sentDate: { [Op.lte]: threeDaysFromNow },
            },
            // Expiring in 1 day
            {
              expiresAt: {
                [Op.lte]: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                [Op.gt]: now,
              },
            },
          ],
        },
      });

      console.log(`📋 Found ${contractsForReminder.length} contracts needing reminders`);

      let sentCount = 0;

      for (const contract of contractsForReminder) {
        const daysUntilExpiry = Math.ceil(
          (new Date(contract.expiresAt) - now) / (1000 * 60 * 60 * 24)
        );

        const reminderType = daysUntilExpiry <= 1 ? 'final' : 'followup';

        const result = await contractEmailService.sendReminder(contract, reminderType);

        if (result.success) {
          sentCount++;
        }
      }

      console.log(`✅ Sent ${sentCount} reminder emails`);

      return { success: true, sentCount };
    } catch (error) {
      console.error('❌ Error sending reminders:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark expired contracts
   */
  async markExpiredContracts() {
    try {
      console.log('⏰ Checking for expired contracts...');

      const now = new Date();

      const [updatedCount] = await ContractInstance.update(
        { status: 'expired' },
        {
          where: {
            status: { [Op.in]: ['sent', 'viewed', 'in_progress'] },
            expiresAt: { [Op.lt]: now },
          },
        }
      );

      console.log(`✅ Marked ${updatedCount} contracts as expired`);

      // TODO: Send expiry notifications to HR

      return { success: true, count: updatedCount };
    } catch (error) {
      console.error('❌ Error marking expired contracts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check overdue onboarding documents
   */
  async checkOverdueDocuments() {
    try {
      console.log('📋 Checking for overdue onboarding documents...');

      const today = new Date().toISOString().split('T')[0];

      const [updatedCount] = await EmployeeOnboardingDocument.update(
        { status: 'overdue' },
        {
          where: {
            dueDate: { [Op.lt]: today },
            status: { [Op.in]: ['pending', 'sent', 'in_progress'] },
          },
        }
      );

      console.log(`✅ Marked ${updatedCount} documents as overdue`);

      return { success: true, count: updatedCount };
    } catch (error) {
      console.error('❌ Error checking overdue documents:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Manual trigger for testing
   */
  async runNow(jobName) {
    console.log(`🔧 Manually running job: ${jobName}`);

    switch (jobName) {
      case 'reminders':
        return await this.sendPendingReminders();
      case 'expiry':
        return await this.markExpiredContracts();
      case 'overdue':
        return await this.checkOverdueDocuments();
      default:
        return { success: false, message: 'Unknown job name' };
    }
  }
}

module.exports = new ContractCronService();

