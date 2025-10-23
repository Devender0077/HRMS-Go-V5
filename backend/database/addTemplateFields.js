const GeneralSetting = require('../models/GeneralSetting');
const sequelize = require('../config/database2');

const newTemplateFields = [
  // Offer Letter
  { settingKey: 'offer_letter_template', settingValue: '<h1>Offer Letter</h1><p>Dear {candidate_name},</p><p>We are pleased to offer you the position of <strong>{position}</strong> at {company_name}.</p><p>Your annual salary will be <strong>{salary}</strong>.</p><p>Your joining date is <strong>{joining_date}</strong>.</p><p>We look forward to having you on our team!</p>', category: 'offer', description: 'Offer Letter Template', type: 'text', isPublic: false },
  { settingKey: 'offer_letter_subject', settingValue: 'Job Offer - {position} at {company_name}', category: 'offer', description: 'Offer Letter Email Subject', type: 'text', isPublic: false },
  { settingKey: 'offer_letter_footer', settingValue: 'This offer is valid for 15 days from the date of issue.', category: 'offer', description: 'Offer Letter Footer', type: 'text', isPublic: false },
  
  // Joining Letter
  { settingKey: 'joining_letter_template', settingValue: '<h1>Joining Letter</h1><p>Dear {employee_name},</p><p>Welcome to {company_name}!</p><p>Your position: <strong>{position}</strong></p><p>Department: <strong>{department}</strong></p><p>Joining Date: <strong>{joining_date}</strong></p><p>We are excited to have you join our team!</p>', category: 'joining', description: 'Joining Letter Template', type: 'text', isPublic: false },
  { settingKey: 'joining_letter_subject', settingValue: 'Welcome to {company_name} - Joining Instructions', category: 'joining', description: 'Joining Letter Email Subject', type: 'text', isPublic: false },
  { settingKey: 'joining_checklist_enabled', settingValue: 'true', category: 'joining', description: 'Enable Joining Checklist', type: 'boolean', isPublic: false },
  
  // Experience Certificate
  { settingKey: 'experience_cert_template', settingValue: '<h1>Experience Certificate</h1><p>This is to certify that <strong>{employee_name}</strong> worked with {company_name} as <strong>{position}</strong> from {join_date} to {end_date}.</p><p>Total Duration: <strong>{duration}</strong></p><p>We wish them all the best in their future endeavors.</p>', category: 'experience', description: 'Experience Certificate Template', type: 'text', isPublic: false },
  { settingKey: 'experience_cert_auto_generate', settingValue: 'false', category: 'experience', description: 'Auto Generate on Exit', type: 'boolean', isPublic: false },
  
  // NOC
  { settingKey: 'noc_template', settingValue: '<h1>No Objection Certificate</h1><p>This is to certify that <strong>{employee_name}</strong>, working as <strong>{position}</strong> at {company_name}, has our permission for <strong>{purpose}</strong>.</p><p>We have no objection to this request.</p>', category: 'noc', description: 'NOC Template', type: 'text', isPublic: false },
  { settingKey: 'noc_validity_days', settingValue: '30', category: 'noc', description: 'NOC Validity Days', type: 'number', isPublic: false },
  
  // Cookie Consent
  { settingKey: 'cookie_consent_message', settingValue: 'We use cookies to enhance your experience and analyze our traffic. By continuing to use this site, you consent to our use of cookies.', category: 'cookie', description: 'Cookie Consent Message', type: 'text', isPublic: true },
  { settingKey: 'cookie_consent_button_text', settingValue: 'Accept', category: 'cookie', description: 'Cookie Consent Button Text', type: 'text', isPublic: true },
  { settingKey: 'cookie_consent_position', settingValue: 'bottom', category: 'cookie', description: 'Cookie Banner Position', type: 'text', isPublic: true },
];

async function addTemplateFields() {
  try {
    console.log('🌱 Adding template fields to database...\n');
    
    for (const field of newTemplateFields) {
      try {
        const [setting, created] = await GeneralSetting.upsert(field, { returning: true });
        
        if (created) {
          console.log(`✅ Created: ${field.settingKey}`);
        } else {
          console.log(`📝 Updated: ${field.settingKey}`);
        }
      } catch (err) {
        console.error(`❌ Error with ${field.settingKey}:`, err.message);
      }
    }
    
    console.log(`\n🎉 Successfully processed ${newTemplateFields.length} template fields!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTemplateFields();

