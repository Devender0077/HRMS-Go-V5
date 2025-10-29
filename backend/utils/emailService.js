/**
 * Email Service Utility
 * Handles sending emails for various system events
 * 
 * TODO: Replace console.log with actual email service (SendGrid, AWS SES, NodeMailer, etc.)
 */

/**
 * Send welcome email to new employee with login credentials
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.name - Employee name
 * @param {string} options.email - Login email
 * @param {string} options.password - Temporary password
 * @param {string} options.loginUrl - URL to login page
 * @returns {Promise<boolean>} - Success status
 */
const sendWelcomeEmail = async ({ to, name, email, password, loginUrl }) => {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    📧 WELCOME EMAIL                          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`To: ${to}`);
  console.log(`Name: ${name}`);
  console.log(`\nSubject: Welcome to HRMS - Your Login Credentials\n`);
  console.log('Email Body:');
  console.log('─'.repeat(64));
  console.log(`Hi ${name},\n`);
  console.log('Welcome to our HRMS system! Your account has been created.\n');
  console.log('LOGIN CREDENTIALS:');
  console.log(`  Email: ${email}`);
  console.log(`  Temporary Password: ${password}`);
  console.log(`  Login URL: ${loginUrl || 'http://localhost:3000/auth/login'}\n`);
  console.log('⚠️ IMPORTANT: For security reasons, please change your password');
  console.log('   after your first login.\n');
  console.log('If you have any questions, please contact HR.\n');
  console.log('Best regards,');
  console.log('HR Team');
  console.log('─'.repeat(64));
  console.log('✅ Email would be sent in production\n');
  
  // TODO: Implement actual email sending
  // Example with nodemailer:
  /*
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Welcome to HRMS - Your Login Credentials',
    html: welcomeEmailTemplate({ name, email, password, loginUrl })
  });
  */
  
  return true;
};

/**
 * Send password reset email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User name
 * @param {string} options.resetToken - Password reset token
 * @param {string} options.resetUrl - Password reset URL
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async ({ to, name, resetToken, resetUrl }) => {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                 🔐 PASSWORD RESET EMAIL                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`To: ${to}`);
  console.log(`Name: ${name}`);
  console.log(`Reset URL: ${resetUrl}?token=${resetToken}`);
  console.log('✅ Email would be sent in production\n');
  
  // TODO: Implement actual email sending
  return true;
};

/**
 * Send system access revoked notification
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.name - User name
 * @returns {Promise<boolean>} - Success status
 */
const sendAccessRevokedEmail = async ({ to, name }) => {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║              ⛔ ACCESS REVOKED NOTIFICATION                  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`To: ${to}`);
  console.log(`Name: ${name}`);
  console.log('Message: Your system access has been revoked. Please contact HR.');
  console.log('✅ Email would be sent in production\n');
  
  // TODO: Implement actual email sending
  return true;
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAccessRevokedEmail,
};

