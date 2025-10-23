/**
 * Professional Document Templates
 * HTML templates for offer letters, joining letters, experience certificates, and NOCs
 */

const PROFESSIONAL_TEMPLATES = {
  // OFFER LETTER TEMPLATE
  offer_letter: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        .letterhead { text-align: center; border-bottom: 3px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1976d2; margin-bottom: 5px; }
        .company-tagline { font-size: 14px; color: #666; font-style: italic; }
        .date { text-align: right; margin-bottom: 30px; font-size: 14px; }
        .subject { font-weight: bold; text-decoration: underline; margin: 20px 0; }
        .content { margin: 20px 0; text-align: justify; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; font-weight: bold; }
        .signature-section { margin-top: 50px; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
        .highlight { background-color: #fff3cd; padding: 2px 5px; }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="company-name">{company_name}</div>
        <div class="company-tagline">Building Tomorrow's Workforce Today</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            {company_address}, {company_city}, {company_state} {company_postal_code}<br>
            Phone: {company_phone} | Email: {company_email} | Web: {company_website}
        </div>
    </div>

    <div class="date">
        Date: {issue_date}
    </div>

    <div style="margin-bottom: 20px;">
        <strong>{employee_name}</strong><br>
        {employee_address}<br>
        {employee_city}, {employee_state} {employee_postal_code}
    </div>

    <div class="subject">
        <strong>Subject: Offer of Employment - {designation}</strong>
    </div>

    <div class="content">
        <p>Dear <strong>{employee_name}</strong>,</p>

        <p>We are pleased to offer you the position of <span class="highlight"><strong>{designation}</strong></span> with {company_name}, reporting to {manager_name}. We were impressed by your qualifications and believe you will be a valuable addition to our team in the <strong>{department}</strong> department at our <strong>{branch}</strong> location.</p>

        <p>The terms and conditions of your employment are as follows:</p>

        <table class="table">
            <tr>
                <th>Employment Details</th>
                <th>Particulars</th>
            </tr>
            <tr>
                <td>Position</td>
                <td><strong>{designation}</strong></td>
            </tr>
            <tr>
                <td>Department</td>
                <td>{department}</td>
            </tr>
            <tr>
                <td>Branch/Location</td>
                <td>{branch}</td>
            </tr>
            <tr>
                <td>Employment Type</td>
                <td>{employment_type}</td>
            </tr>
            <tr>
                <td>Date of Joining</td>
                <td><strong>{joining_date}</strong></td>
            </tr>
            <tr>
                <td>Reporting To</td>
                <td>{manager_name} ({manager_designation})</td>
            </tr>
            <tr>
                <td>Annual CTC</td>
                <td><strong>{currency_symbol}{annual_ctc}</strong></td>
            </tr>
            <tr>
                <td>Monthly Gross Salary</td>
                <td>{currency_symbol}{monthly_salary}</td>
            </tr>
            <tr>
                <td>Work Schedule</td>
                <td>{shift} ({work_hours} hours/day)</td>
            </tr>
            <tr>
                <td>Probation Period</td>
                <td>{probation_period} months</td>
            </tr>
        </table>

        <p><strong>Benefits:</strong></p>
        <ul>
            <li>Annual Leave: {annual_leave_days} days</li>
            <li>Sick Leave: {sick_leave_days} days</li>
            <li>Health Insurance Coverage</li>
            <li>Performance Bonus (as per company policy)</li>
            <li>Professional Development Opportunities</li>
        </ul>

        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>This offer is contingent upon successful background verification and reference checks.</li>
            <li>You will be required to submit necessary documents as listed in the joining kit.</li>
            <li>Your employment will be governed by the company's policies and procedures.</li>
            <li>Please sign and return this letter by {response_deadline} to confirm your acceptance.</li>
        </ul>

        <p>We are excited about the prospect of you joining our team and look forward to a mutually rewarding association.</p>

        <p>Should you have any questions, please feel free to contact our HR department at {company_email} or {company_phone}.</p>

        <p>Congratulations and welcome aboard!</p>
    </div>

    <div class="signature-section">
        <p><strong>For {company_name}</strong></p>
        <div class="signature-line"></div>
        <p>
            <strong>{hr_manager_name}</strong><br>
            HR Manager<br>
            Date: {issue_date}
        </p>
    </div>

    <div style="margin-top: 60px; border-top: 2px dashed #ccc; padding-top: 20px;">
        <p><strong>ACCEPTANCE</strong></p>
        <p>I, {employee_name}, accept the above terms and conditions of employment.</p>
        <div class="signature-line"></div>
        <p>
            <strong>Signature of Employee</strong><br>
            Date: __________________
        </p>
    </div>

    <div class="footer">
        <p><strong>{company_name}</strong> | {company_legal_name}<br>
        Tax ID: {company_tax_id} | Registration No: {company_registration_number}</p>
        <p><em>This is a computer-generated document and does not require a physical signature.</em></p>
    </div>
</body>
</html>`,

  // JOINING LETTER TEMPLATE
  joining_letter: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        .letterhead { text-align: center; border-bottom: 3px solid #2e7d32; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #2e7d32; margin-bottom: 5px; }
        .date { text-align: right; margin-bottom: 30px; font-size: 14px; }
        .subject { font-weight: bold; text-decoration: underline; margin: 20px 0; text-align: center; }
        .content { margin: 20px 0; text-align: justify; }
        .welcome-box { background-color: #e8f5e9; border-left: 4px solid #2e7d32; padding: 15px; margin: 20px 0; }
        .info-box { background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .checklist { background-color: #fff9c4; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .signature-section { margin-top: 50px; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="company-name">{company_name}</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            {company_address}, {company_city}, {company_state} {company_postal_code}<br>
            Phone: {company_phone} | Email: {company_email}
        </div>
    </div>

    <div class="date">
        Date: {issue_date}
    </div>

    <div style="margin-bottom: 20px;">
        <strong>{employee_name}</strong><br>
        Employee ID: <strong>{employee_id}</strong><br>
        {designation} - {department}
    </div>

    <div class="subject">
        <strong>WELCOME TO {company_name}!</strong>
    </div>

    <div class="content">
        <div class="welcome-box">
            <p style="margin: 0; font-size: 16px;"><strong>🎉 Congratulations and Welcome!</strong></p>
        </div>

        <p>Dear <strong>{employee_name}</strong>,</p>

        <p>We are delighted to welcome you to the {company_name} family! On behalf of the entire team, we extend our warmest welcome as you begin your journey with us as <strong>{designation}</strong> in the <strong>{department}</strong> department.</p>

        <p>This letter serves to confirm your joining and provide essential information for your first day and initial weeks with us.</p>

        <div class="info-box">
            <p><strong>📋 Your Employment Details:</strong></p>
            <ul style="margin: 10px 0;">
                <li><strong>Employee ID:</strong> {employee_id}</li>
                <li><strong>Designation:</strong> {designation}</li>
                <li><strong>Department:</strong> {department}</li>
                <li><strong>Branch:</strong> {branch}</li>
                <li><strong>Date of Joining:</strong> {joining_date}</li>
                <li><strong>Reporting Manager:</strong> {manager_name}</li>
                <li><strong>Work Schedule:</strong> {shift}</li>
                <li><strong>Work Email:</strong> {work_email}</li>
            </ul>
        </div>

        <div class="checklist">
            <p><strong>✅ First Day Checklist - Please Bring:</strong></p>
            <ol style="margin: 10px 0;">
                <li>Original and photocopies of educational certificates</li>
                <li>Previous employment documents (if applicable)</li>
                <li>Government-issued photo ID proof (Passport/Driver's License/National ID)</li>
                <li>Address proof (utility bill/lease agreement)</li>
                <li>Passport-size photographs (4 copies)</li>
                <li>Bank account details for salary credit</li>
                <li>Emergency contact information</li>
                <li>Medical fitness certificate (if required for your role)</li>
            </ol>
        </div>

        <p><strong>📍 Reporting Details for First Day:</strong></p>
        <ul>
            <li><strong>Date:</strong> {joining_date}</li>
            <li><strong>Time:</strong> {reporting_time}</li>
            <li><strong>Venue:</strong> {branch}<br>{company_address}, {company_city}</li>
            <li><strong>Report To:</strong> HR Department / Reception</li>
            <li><strong>Contact Person:</strong> {hr_contact_person} ({hr_contact_phone})</li>
        </ul>

        <p><strong>📚 What to Expect on Your First Day:</strong></p>
        <ul>
            <li>Welcome orientation and introduction to the team</li>
            <li>Completion of joining formalities and documentation</li>
            <li>Assignment of workspace, equipment, and credentials</li>
            <li>Briefing on company policies, culture, and values</li>
            <li>Introduction to your immediate team and manager</li>
            <li>Overview of your role and initial responsibilities</li>
        </ul>

        <p><strong>💡 Important Information:</strong></p>
        <ul>
            <li>Your probation period is <strong>{probation_period} months</strong>, during which your performance will be reviewed.</li>
            <li>You will receive your employee handbook and policy documents on the first day.</li>
            <li>IT access and email credentials will be provided during orientation.</li>
            <li>Please review and familiarize yourself with our company website before joining.</li>
        </ul>

        <p>We believe you will find your association with {company_name} professionally rewarding and personally fulfilling. Our team is committed to supporting your growth and success.</p>

        <p>If you have any questions before your joining date, please don't hesitate to contact us at {company_email} or {company_phone}.</p>

        <p>Once again, welcome to {company_name}. We look forward to working with you!</p>

        <p><strong>Best Regards,</strong></p>
    </div>

    <div class="signature-section">
        <p><strong>For {company_name}</strong></p>
        <div class="signature-line"></div>
        <p>
            <strong>{hr_manager_name}</strong><br>
            HR Manager<br>
            Date: {issue_date}
        </p>
    </div>

    <div class="footer">
        <p><strong>{company_name}</strong> | {company_legal_name}<br>
        Tax ID: {company_tax_id}</p>
        <p><em>This is an official communication from {company_name}.</em></p>
    </div>
</body>
</html>`,

  // EXPERIENCE CERTIFICATE TEMPLATE
  experience_certificate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.8; color: #333; margin: 40px; }
        .certificate-border { border: 8px double #1976d2; padding: 30px; }
        .letterhead { text-align: center; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 32px; font-weight: bold; color: #1976d2; margin-bottom: 10px; }
        .certificate-title { text-align: center; font-size: 24px; font-weight: bold; text-decoration: underline; margin: 30px 0; color: #1976d2; }
        .cert-number { text-align: right; font-size: 12px; color: #666; margin-bottom: 20px; }
        .content { margin: 30px 0; text-align: justify; font-size: 15px; }
        .employee-details { background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #1976d2; }
        .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
        .signature-block { text-align: center; }
        .signature-line { border-top: 2px solid #333; width: 200px; margin: 50px auto 10px; }
        .stamp-area { border: 2px dashed #ccc; width: 150px; height: 150px; margin: 20px auto; display: flex; align-items: center; justify-content: center; color: #ccc; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #666; text-align: center; }
        .verification-code { font-family: monospace; background: #f0f0f0; padding: 5px 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="certificate-border">
        <div class="letterhead">
            <div class="company-name">{company_name}</div>
            <div style="font-size: 13px; color: #666; margin-top: 10px;">
                {company_legal_name}<br>
                {company_address}, {company_city}, {company_state} {company_postal_code}<br>
                Phone: {company_phone} | Email: {company_email} | Web: {company_website}
            </div>
        </div>

        <div class="cert-number">
            Certificate No: {certificate_number}<br>
            Issue Date: {issue_date}
        </div>

        <div class="certificate-title">
            EXPERIENCE CERTIFICATE
        </div>

        <div class="content">
            <p style="font-size: 16px;"><strong>TO WHOM IT MAY CONCERN</strong></p>

            <p>This is to certify that <strong>{employee_name}</strong> (Employee ID: <strong>{employee_id}</strong>) was employed with <strong>{company_name}</strong> from <strong>{joining_date}</strong> to <strong>{termination_date}</strong>.</p>

            <div class="employee-details">
                <p style="margin: 5px 0;"><strong>Employee Information:</strong></p>
                <table style="width: 100%; margin-top: 10px;">
                    <tr>
                        <td style="padding: 5px; width: 40%;"><strong>Name:</strong></td>
                        <td style="padding: 5px;">{employee_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Employee ID:</strong></td>
                        <td style="padding: 5px;">{employee_id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Designation:</strong></td>
                        <td style="padding: 5px;">{designation}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Department:</strong></td>
                        <td style="padding: 5px;">{department}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Branch/Location:</strong></td>
                        <td style="padding: 5px;">{branch}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Period of Employment:</strong></td>
                        <td style="padding: 5px;">{joining_date} to {termination_date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Total Experience:</strong></td>
                        <td style="padding: 5px;"><strong>{total_experience}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Last Designation Held:</strong></td>
                        <td style="padding: 5px;">{last_designation}</td>
                    </tr>
                </table>
            </div>

            <p>During the tenure, <strong>{employee_name}</strong> worked with dedication and sincerity. {he_she} demonstrated professionalism in {his_her} work and maintained good working relationships with colleagues and management.</p>

            <p>{his_her_cap} primary responsibilities included:</p>
            <ul>
                <li>{responsibility_1}</li>
                <li>{responsibility_2}</li>
                <li>{responsibility_3}</li>
            </ul>

            <p>We found {his_her} to be a {performance_rating} employee who contributed positively to the team and organization. {he_she_cap} left the organization on <strong>{termination_date}</strong> due to <strong>{termination_reason}</strong>.</p>

            <p>We wish {him_her} all the best in {his_her} future endeavors.</p>

            <p>This certificate is issued upon the request of the employee for official purposes.</p>

            <p>If you require any further information, please feel free to contact our HR department at {company_email} or {company_phone}.</p>
        </div>

        <div class="signature-section">
            <div class="signature-block">
                <div class="signature-line"></div>
                <p>
                    <strong>{hr_manager_name}</strong><br>
                    HR Manager<br>
                    {company_name}
                </p>
            </div>

            <div class="signature-block">
                <div class="stamp-area">
                    Company Seal
                </div>
            </div>

            <div class="signature-block">
                <div class="signature-line"></div>
                <p>
                    <strong>{authorized_signatory_name}</strong><br>
                    {authorized_signatory_designation}<br>
                    {company_name}
                </p>
            </div>
        </div>

        <div class="footer">
            <p><strong>{company_name}</strong> | {company_legal_name}<br>
            Tax ID: {company_tax_id} | Registration No: {company_registration_number}</p>
            <p>Verification Code: <span class="verification-code">{verification_code}</span> | Verify at: {company_website}/verify</p>
            <p><em>This is a digitally generated certificate. No manual signature is required.</em></p>
        </div>
    </div>
</body>
</html>`,

  // NOC (No Objection Certificate) TEMPLATE
  noc: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.8; color: #333; margin: 40px; }
        .letterhead { text-align: center; border-bottom: 3px solid #f57c00; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #f57c00; margin-bottom: 5px; }
        .date { text-align: right; margin-bottom: 30px; font-size: 14px; }
        .ref-number { text-align: left; margin-bottom: 20px; font-size: 14px; font-weight: bold; }
        .subject { font-weight: bold; text-decoration: underline; margin: 20px 0; }
        .noc-title { text-align: center; font-size: 22px; font-weight: bold; margin: 30px 0; color: #f57c00; text-transform: uppercase; }
        .content { margin: 20px 0; text-align: justify; }
        .highlight-box { background-color: #fff3e0; border-left: 4px solid #f57c00; padding: 15px; margin: 20px 0; }
        .signature-section { margin-top: 50px; }
        .signature-line { border-top: 2px solid #333; width: 200px; margin-top: 60px; }
        .stamp-area { border: 2px dashed #ccc; width: 120px; height: 120px; margin: 20px 0; display: inline-flex; align-items: center; justify-content: center; color: #ccc; font-size: 12px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="company-name">{company_name}</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">
            {company_legal_name}<br>
            {company_address}, {company_city}, {company_state} {company_postal_code}<br>
            Phone: {company_phone} | Email: {company_email} | Web: {company_website}
        </div>
    </div>

    <div class="ref-number">
        Ref No: {reference_number}
    </div>

    <div class="date">
        Date: {issue_date}
    </div>

    <div style="margin-bottom: 20px;">
        <strong>To,</strong><br>
        {recipient_name}<br>
        {recipient_designation}<br>
        {recipient_organization}<br>
        {recipient_address}
    </div>

    <div class="noc-title">
        NO OBJECTION CERTIFICATE
    </div>

    <div class="subject">
        <strong>Subject: No Objection Certificate for {employee_name} - {purpose}</strong>
    </div>

    <div class="content">
        <p>Dear Sir/Madam,</p>

        <p>This is to certify that <strong>{employee_name}</strong> (Employee ID: <strong>{employee_id}</strong>) is currently employed with <strong>{company_name}</strong> as <strong>{designation}</strong> in the <strong>{department}</strong> department.</p>

        <div class="highlight-box">
            <p style="margin: 0;"><strong>Employee Details:</strong></p>
            <table style="width: 100%; margin-top: 10px;">
                <tr>
                    <td style="padding: 5px; width: 35%;"><strong>Full Name:</strong></td>
                    <td style="padding: 5px;">{employee_name}</td>
                </tr>
                <tr>
                    <td style="padding: 5px;"><strong>Employee ID:</strong></td>
                    <td style="padding: 5px;">{employee_id}</td>
                </tr>
                <tr>
                    <td style="padding: 5px;"><strong>Designation:</strong></td>
                    <td style="padding: 5px;">{designation}</td>
                </tr>
                <tr>
                    <td style="padding: 5px;"><strong>Department:</strong></td>
                    <td style="padding: 5px;">{department}</td>
                </tr>
                <tr>
                    <td style="padding: 5px;"><strong>Date of Joining:</strong></td>
                    <td style="padding: 5px;">{joining_date}</td>
                </tr>
                <tr>
                    <td style="padding: 5px;"><strong>Employment Type:</strong></td>
                    <td style="padding: 5px;">{employment_type}</td>
                </tr>
            </table>
        </div>

        <p><strong>{company_name}</strong> has <strong>NO OBJECTION</strong> to <strong>{employee_name}</strong> pursuing/undertaking the following:</p>

        <div style="background-color: #fffde7; padding: 15px; margin: 20px 0; border: 2px solid #f57c00; border-radius: 5px;">
            <p style="margin: 0; font-size: 16px; text-align: center;"><strong>{purpose}</strong></p>
        </div>

        <p><strong>Conditions/Terms (if any):</strong></p>
        <ul>
            <li>The employee shall ensure that this activity does not interfere with their regular work responsibilities and duties at {company_name}.</li>
            <li>The employee must maintain professional conduct and uphold the reputation of {company_name}.</li>
            <li>Any commitments made in this regard should not conflict with the employee's employment contract with {company_name}.</li>
            <li>{additional_condition_1}</li>
            <li>{additional_condition_2}</li>
        </ul>

        <p><strong>Validity:</strong> This certificate is valid from <strong>{valid_from}</strong> to <strong>{valid_until}</strong> or until the employee's employment with {company_name}, whichever is earlier.</p>

        <p><strong>Purpose:</strong> This No Objection Certificate is issued upon the request of the employee for <strong>{purpose}</strong>.</p>

        <p>This certificate is being issued based on the information provided by the employee and is valid for official purposes only. The company shall not be held liable for any misuse of this certificate.</p>

        <p>For any verification or further information, please contact our HR department at:</p>
        <ul style="list-style: none; padding-left: 0;">
            <li>📧 Email: {company_email}</li>
            <li>📞 Phone: {company_phone}</li>
            <li>🌐 Website: {company_website}</li>
        </ul>

        <p>Thank you for your understanding and cooperation.</p>

        <p><strong>Yours Sincerely,</strong></p>
    </div>

    <div class="signature-section">
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div class="signature-line"></div>
                    <p>
                        <strong>{hr_manager_name}</strong><br>
                        HR Manager<br>
                        {company_name}<br>
                        Date: {issue_date}
                    </p>
                </td>
                <td style="width: 50%; text-align: center; vertical-align: top;">
                    <div class="stamp-area">
                        Company Seal & Stamp
                    </div>
                    <div class="signature-line" style="margin: 20px auto;"></div>
                    <p>
                        <strong>{authorized_signatory_name}</strong><br>
                        {authorized_signatory_designation}<br>
                        {company_name}
                    </p>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p><strong>{company_name}</strong> | {company_legal_name}<br>
        Tax ID: {company_tax_id} | Registration No: {company_registration_number}</p>
        <p>Reference Number: <strong>{reference_number}</strong> | Issue Date: {issue_date}</p>
        <p><em>This is an official document from {company_name}. For verification, please contact HR at {company_email}</em></p>
    </div>
</body>
</html>`,
};

module.exports = PROFESSIONAL_TEMPLATES;

