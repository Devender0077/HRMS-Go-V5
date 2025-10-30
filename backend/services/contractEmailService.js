const nodemailer = require('nodemailer');

/**
 * Contract Email Notification Service
 * Handles all email communications for the contract management system
 */

class ContractEmailService {
  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send contract to recipient
   */
  async sendContract(contract) {
    try {
      const signUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/contracts/sign/${contract.id}`;

      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'HRMS Go'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: contract.recipientEmail,
        subject: `Action Required: Sign ${contract.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1976d2;">Contract Signature Required</h2>
            
            <p>Dear ${contract.recipientName || 'Team Member'},</p>
            
            <p>You have been sent a contract that requires your signature:</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${contract.title}</h3>
              <p style="margin: 5px 0;"><strong>Contract #:</strong> ${contract.contractNumber}</p>
              <p style="margin: 5px 0;"><strong>Expires:</strong> ${new Date(contract.expiresAt).toLocaleDateString()}</p>
            </div>
            
            <p>Please review and sign the contract at your earliest convenience:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signUrl}" 
                 style="background: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                Review & Sign Contract
              </a>
            </div>
            
            <p style="color: #666; font-size: 12px;">
              This link will expire on ${new Date(contract.expiresAt).toLocaleDateString()}.
              If you have any questions, please contact HR.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 11px; text-align: center;">
              This is an automated message from HRMS Go. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contract email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending contract email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send reminder email
   */
  async sendReminder(contract, reminderType = 'followup') {
    try {
      const signUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/contracts/sign/${contract.id}`;
      const daysRemaining = Math.ceil((new Date(contract.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));

      let subject, message;

      if (reminderType === 'initial') {
        subject = `Reminder: Sign ${contract.title}`;
        message = 'This is a friendly reminder that you have a pending contract to sign.';
      } else if (reminderType === 'final') {
        subject = `Urgent: Contract Expiring Soon - ${contract.title}`;
        message = `This contract will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Please sign it as soon as possible.`;
      } else {
        subject = `Reminder: Sign ${contract.title}`;
        message = 'You still have a pending contract that needs your signature.';
      }

      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'HRMS Go'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: contract.recipientEmail,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${reminderType === 'final' ? '#d32f2f' : '#ff9800'};">
              ${reminderType === 'final' ? '⚠️ Urgent Reminder' : '📄 Reminder'}
            </h2>
            
            <p>Dear ${contract.recipientName || 'Team Member'},</p>
            
            <p>${message}</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${contract.title}</h3>
              <p style="margin: 5px 0;"><strong>Contract #:</strong> ${contract.contractNumber}</p>
              <p style="margin: 5px 0;"><strong>Sent:</strong> ${new Date(contract.sentDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0; color: ${daysRemaining <= 2 ? '#d32f2f' : '#666'};">
                <strong>Expires:</strong> ${new Date(contract.expiresAt).toLocaleDateString()} 
                (${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining)
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signUrl}" 
                 style="background: ${reminderType === 'final' ? '#d32f2f' : '#ff9800'}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                Sign Now
              </a>
            </div>
            
            <p style="color: #666; font-size: 12px;">
              If you have any questions, please contact HR.
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Reminder email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending reminder email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send completion notification
   */
  async sendCompletionNotification(contract) {
    try {
      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'HRMS Go'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: contract.recipientEmail,
        subject: `Contract Completed: ${contract.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4caf50;">✅ Contract Signed Successfully</h2>
            
            <p>Dear ${contract.recipientName || 'Team Member'},</p>
            
            <p>Thank you for signing your contract!</p>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="margin-top: 0; color: #2e7d32;">${contract.title}</h3>
              <p style="margin: 5px 0;"><strong>Contract #:</strong> ${contract.contractNumber}</p>
              <p style="margin: 5px 0;"><strong>Signed:</strong> ${new Date(contract.completedDate).toLocaleDateString()}</p>
            </div>
            
            <p>A copy of the signed contract has been stored securely in your employee profile.</p>
            
            <p>If you need to download a copy, you can access it from your onboarding dashboard.</p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you have any questions, please contact HR.
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Completion email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending completion email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send expiration notification to HR
   */
  async sendExpiryNotification(contract, hrEmail) {
    try {
      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'HRMS Go'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: hrEmail,
        subject: `Contract Expired: ${contract.contractNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">⚠️ Contract Expired</h2>
            
            <p>A contract has expired without being signed:</p>
            
            <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
              <h3 style="margin-top: 0;">${contract.title}</h3>
              <p style="margin: 5px 0;"><strong>Contract #:</strong> ${contract.contractNumber}</p>
              <p style="margin: 5px 0;"><strong>Recipient:</strong> ${contract.recipientName} (${contract.recipientEmail})</p>
              <p style="margin: 5px 0;"><strong>Sent:</strong> ${new Date(contract.sentDate).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Expired:</strong> ${new Date(contract.expiresAt).toLocaleDateString()}</p>
            </div>
            
            <p>Please follow up with the recipient or resend the contract.</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Expiry notification sent to HR:', info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('❌ Error sending expiry notification:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new ContractEmailService();

