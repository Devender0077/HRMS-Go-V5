/**
 * Professional Document Templates - Consistent A4 Design
 * Features: Inline logo, proper header/footer, print-ready A4 format
 */

// Common CSS for all templates - A4 size with proper print margins
const COMMON_STYLES = `
    @page { 
        size: A4; 
        margin: 15mm 15mm 15mm 15mm;
    }
    
    @media print { 
        body { margin: 0; }
        .page { margin: 0; padding: 0; box-shadow: none; }
        .no-print { display: none; }
    }
    
    * { box-sizing: border-box; }
    
    body { 
        font-family: 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif; 
        line-height: 1.6; 
        color: #2c3e50; 
        margin: 0;
        padding: 0;
        background: #f5f5f5;
    }
    
    .page {
        width: 210mm;
        min-height: 297mm;
        padding: 0;
        margin: 10mm auto;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        position: relative;
    }
    
    /* Header with proper padding */
    .header {
        padding: 15mm 20mm 10mm 20mm;
        border-bottom: 3px solid #1976d2;
        background: white;
    }
    
    /* Letterhead with inline logo */
    .letterhead {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin-bottom: 15px;
    }
    
    .logo-container {
        flex-shrink: 0;
    }
    
    .logo {
        height: 50px;
        width: auto;
        max-width: 150px;
        display: block;
    }
    
    .company-info {
        text-align: center;
        flex: 1;
    }
    
    .company-name {
        font-size: 22px;
        font-weight: 700;
        color: #1976d2;
        margin: 0 0 8px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .company-details {
        font-size: 10px;
        color: #666;
        line-height: 1.5;
        margin: 0;
    }
    
    /* Main content area */
    .content-area {
        padding: 15mm 20mm;
        min-height: 200mm;
    }
    
    .document-title {
        text-align: center;
        font-size: 18px;
        font-weight: 700;
        color: #1976d2;
        margin: 0 0 20px 0;
        text-transform: uppercase;
        letter-spacing: 1.5px;
    }
    
    .date-ref {
        text-align: right;
        font-size: 11px;
        color: #555;
        margin-bottom: 20px;
    }
    
    .recipient-address {
        margin-bottom: 20px;
        font-size: 12px;
        line-height: 1.5;
    }
    
    .content {
        font-size: 12px;
        text-align: justify;
    }
    
    .content p {
        margin: 10px 0;
    }
    
    .content ul, .content ol {
        margin: 10px 0;
        padding-left: 25px;
    }
    
    .content li {
        margin: 5px 0;
    }
    
    .info-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 11px;
    }
    
    .info-table th,
    .info-table td {
        border: 1px solid #dee2e6;
        padding: 8px 10px;
        text-align: left;
    }
    
    .info-table th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #495057;
    }
    
    .info-box {
        background-color: #f8f9fa;
        padding: 12px 15px;
        margin: 15px 0;
        border-left: 4px solid #1976d2;
        font-size: 11px;
    }
    
    .info-box table {
        width: 100%;
        margin-top: 8px;
    }
    
    .info-box td {
        padding: 4px 0;
    }
    
    .highlight {
        background-color: #fff3cd;
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: 600;
    }
    
    .highlight-box {
        background-color: #fff9e6;
        padding: 12px;
        margin: 15px 0;
        text-align: center;
        border-radius: 4px;
    }
    
    .welcome-box {
        background-color: #e3f2fd;
        padding: 12px;
        margin: 15px 0;
        text-align: center;
        border-radius: 4px;
    }
    
    .signature-section {
        margin-top: 40px;
    }
    
    .signature-block {
        display: inline-block;
        width: 45%;
        vertical-align: top;
    }
    
    .signature-line {
        border-top: 1px solid #333;
        width: 160px;
        margin-top: 40px;
        margin-bottom: 5px;
    }
    
    /* Footer with proper padding */
    .footer {
        padding: 10mm 20mm 15mm 20mm;
        border-top: 1px solid #dee2e6;
        font-size: 9px;
        color: #6c757d;
        text-align: center;
        background: white;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    
    .footer-mark {
        font-style: italic;
        margin-top: 5px;
        display: block;
    }
    
    strong { color: #2c3e50; font-weight: 600; }
`;

const PROFESSIONAL_TEMPLATES = {
  // ========================================
  // OFFER LETTER TEMPLATE
  // ========================================
  offer_letter: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offer Letter</title>
    <style>${COMMON_STYLES}</style>
</head>
<body>
    <div class="page">
        <!-- Header with Letterhead -->
        <div class="header">
            <div class="letterhead">
                <div class="logo-container">
                    <img src="{app_logo}" alt="{company_name}" class="logo" />
                </div>
                <div class="company-info">
                    <div class="company-name">{company_name}</div>
                    <div class="company-details">
                        {company_address}, {company_city}, {company_state} {company_postal_code}, {company_country}<br>
                        Phone: {company_phone} | Email: {company_email} | Website: {company_website}
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Reference & Date -->
            <div class="date-ref">
                <strong>Ref:</strong> {company_name}/HR/OFFER/{employee_id}<br>
                <strong>Date:</strong> {issue_date}
            </div>

            <!-- Recipient -->
            <div class="recipient-address">
                <strong>{employee_name}</strong><br>
                {employee_address}<br>
                {employee_city}, {employee_state} {employee_postal_code}
            </div>

            <!-- Subject -->
            <p><strong>Subject: Offer of Employment - {designation}</strong></p>

            <!-- Content -->
            <div class="content">
                <p>Dear <strong>{employee_name}</strong>,</p>

                <p>We are pleased to offer you the position of <span class="highlight">{designation}</span> with {company_name}. We believe your skills and experience will be a valuable addition to our <strong>{department}</strong> team at <strong>{branch}</strong>.</p>

                <p><strong>Terms and Conditions of Employment:</strong></p>

                <table class="info-table">
                    <tr>
                        <th width="40%">Employment Details</th>
                        <th width="60%">Particulars</th>
                    </tr>
                    <tr><td>Position</td><td><strong>{designation}</strong></td></tr>
                    <tr><td>Department</td><td>{department}</td></tr>
                    <tr><td>Branch/Location</td><td>{branch}</td></tr>
                    <tr><td>Employment Type</td><td>{employment_type}</td></tr>
                    <tr><td>Date of Joining</td><td><strong>{joining_date}</strong></td></tr>
                    <tr><td>Reporting To</td><td>{manager_name}, {manager_designation}</td></tr>
                    <tr><td>Work Schedule</td><td>{shift}</td></tr>
                    <tr><td>Annual CTC</td><td><strong>{currency_symbol}{annual_ctc}</strong></td></tr>
                    <tr><td>Monthly Gross Salary</td><td>{currency_symbol}{monthly_salary}</td></tr>
                    <tr><td>Probation Period</td><td>{probation_period} months</td></tr>
                </table>

                <p><strong>Benefits & Entitlements:</strong></p>
                <ul>
                    <li>Annual Leave: {annual_leave_days} days per year</li>
                    <li>Sick Leave: {sick_leave_days} days per year</li>
                    <li>Health Insurance Coverage</li>
                    <li>Performance-based bonuses</li>
                    <li>Professional development opportunities</li>
                </ul>

                <p><strong>Terms & Conditions:</strong></p>
                <ul>
                    <li>This offer is contingent upon successful background verification.</li>
                    <li>Required documents must be submitted as per joining kit.</li>
                    <li>Employment governed by company policies and procedures.</li>
                    <li>Please confirm acceptance by <strong>{response_deadline}</strong>.</li>
                </ul>

                <p>We look forward to a mutually rewarding association. For questions, contact {company_email} or {company_phone}.</p>

                <p><strong>Congratulations and welcome aboard!</strong></p>

                <p style="margin-top: 25px;"><strong>Sincerely,</strong></p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <strong>{hr_manager_name}</strong><br>
                    HR Manager<br>
                    {company_name}
                </div>
            </div>

            <!-- Acceptance Section -->
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px dashed #ccc;">
                <p><strong>ACCEPTANCE</strong></p>
                <p style="font-size: 11px;">I, {employee_name}, accept the above terms and conditions.</p>
                <div class="signature-line"></div>
                <strong>Employee Signature</strong><br>
                Date: _______________
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <strong>{company_name}</strong> | {company_legal_name}<br>
            Tax ID: {company_tax_id} | Registration No: {company_registration_number}<br>
            <span class="footer-mark">{offer_letter_footer}</span>
        </div>
    </div>
</body>
</html>`,

  // ========================================
  // JOINING LETTER TEMPLATE
  // ========================================
  joining_letter: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joining Letter</title>
    <style>${COMMON_STYLES}</style>
</head>
<body>
    <div class="page">
        <!-- Header with Letterhead -->
        <div class="header">
            <div class="letterhead">
                <div class="logo-container">
                    <img src="{app_logo}" alt="{company_name}" class="logo" />
                </div>
                <div class="company-info">
                    <div class="company-name">{company_name}</div>
                    <div class="company-details">
                        {company_address}, {company_city}, {company_state} {company_postal_code}, {company_country}<br>
                        Phone: {company_phone} | Email: {company_email} | Website: {company_website}
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Reference & Date -->
            <div class="date-ref">
                <strong>Ref:</strong> {company_name}/HR/JOIN/{employee_id}<br>
                <strong>Date:</strong> {issue_date}
            </div>

            <!-- Recipient -->
            <div class="recipient-address">
                <strong>{employee_name}</strong><br>
                Employee ID: <strong>{employee_id}</strong><br>
                {designation} - {department}
            </div>

            <!-- Subject -->
            <p><strong>Subject: Welcome to {company_name} - Joining Confirmation</strong></p>

            <!-- Content -->
            <div class="content">
                <div class="welcome-box">
                    <strong style="font-size: 14px; color: #1976d2;">🎉 Welcome to the {company_name} Family!</strong>
                </div>

                <p>Dear <strong>{employee_name}</strong>,</p>

                <p>We are delighted to welcome you to {company_name}! This letter confirms your joining as <strong>{designation}</strong> in the <strong>{department}</strong> department.</p>

                <div class="info-box">
                    <strong>Your Employment Details:</strong>
                    <table>
                        <tr><td width="45%"><strong>Employee ID:</strong></td><td>{employee_id}</td></tr>
                        <tr><td><strong>Designation:</strong></td><td>{designation}</td></tr>
                        <tr><td><strong>Department:</strong></td><td>{department}</td></tr>
                        <tr><td><strong>Branch:</strong></td><td>{branch}</td></tr>
                        <tr><td><strong>Joining Date:</strong></td><td><strong>{joining_date}</strong></td></tr>
                        <tr><td><strong>Reporting To:</strong></td><td>{manager_name}</td></tr>
                        <tr><td><strong>Work Schedule:</strong></td><td>{shift}</td></tr>
                        <tr><td><strong>Work Email:</strong></td><td>{work_email}</td></tr>
                    </table>
                </div>

                <p><strong>First Day Reporting:</strong></p>
                <ul>
                    <li><strong>Date:</strong> {joining_date}</li>
                    <li><strong>Time:</strong> {reporting_time}</li>
                    <li><strong>Venue:</strong> {branch}, {company_address}, {company_city}</li>
                    <li><strong>Report To:</strong> HR Department / Reception</li>
                    <li><strong>Contact:</strong> {hr_contact_person} ({hr_contact_phone})</li>
                </ul>

                <p><strong>Documents to Bring:</strong></p>
                <ol>
                    <li>Educational certificates (original + copies)</li>
                    <li>Previous employment documents (if applicable)</li>
                    <li>Government-issued photo ID</li>
                    <li>Address proof</li>
                    <li>Passport photos (4 copies)</li>
                    <li>Bank details for salary credit</li>
                    <li>Emergency contact information</li>
                </ol>

                <p><strong>First Day Activities:</strong> Orientation, documentation, workspace setup, team introduction, and policy briefing.</p>

                <p>Your probation period is <strong>{probation_period} months</strong>. For questions, contact {company_email} or {company_phone}.</p>

                <p>We look forward to working with you!</p>

                <p style="margin-top: 25px;"><strong>Best Regards,</strong></p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <strong>{hr_manager_name}</strong><br>
                    HR Manager<br>
                    {company_name}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <strong>{company_name}</strong> | {company_legal_name}<br>
            Tax ID: {company_tax_id} | Registration No: {company_registration_number}<br>
            <span class="footer-mark">This is an official communication from {company_name}.</span>
        </div>
    </div>
</body>
</html>`,

  // ========================================
  // EXPERIENCE CERTIFICATE TEMPLATE
  // ========================================
  experience_certificate: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Experience Certificate</title>
    <style>${COMMON_STYLES}</style>
</head>
<body>
    <div class="page">
        <!-- Header with Letterhead -->
        <div class="header">
            <div class="letterhead">
                <div class="logo-container">
                    <img src="{app_logo}" alt="{company_name}" class="logo" />
                </div>
                <div class="company-info">
                    <div class="company-name">{company_name}</div>
                    <div class="company-details">
                        {company_legal_name}<br>
                        {company_address}, {company_city}, {company_state} {company_postal_code}, {company_country}<br>
                        Phone: {company_phone} | Email: {company_email} | Website: {company_website}
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Certificate Number & Date -->
            <div class="date-ref">
                <strong>Certificate No:</strong> {certificate_number}<br>
                <strong>Issue Date:</strong> {issue_date}
            </div>

            <!-- Title -->
            <div class="document-title">
                EXPERIENCE CERTIFICATE
            </div>

            <!-- Content -->
            <div class="content">
                <p style="font-size: 13px; font-weight: 600; margin-bottom: 15px;">TO WHOM IT MAY CONCERN</p>

                <p>This is to certify that <strong>{employee_name}</strong> (Employee ID: <strong>{employee_id}</strong>) was employed with <strong>{company_name}</strong> from <strong>{joining_date}</strong> to <strong>{termination_date}</strong>.</p>

                <div class="info-box">
                    <strong>Employee Information:</strong>
                    <table>
                        <tr><td width="45%"><strong>Full Name:</strong></td><td>{employee_name}</td></tr>
                        <tr><td><strong>Employee ID:</strong></td><td>{employee_id}</td></tr>
                        <tr><td><strong>Designation:</strong></td><td>{designation}</td></tr>
                        <tr><td><strong>Department:</strong></td><td>{department}</td></tr>
                        <tr><td><strong>Branch/Location:</strong></td><td>{branch}</td></tr>
                        <tr><td><strong>Period of Service:</strong></td><td>{joining_date} to {termination_date}</td></tr>
                        <tr><td><strong>Total Experience:</strong></td><td><strong>{total_experience}</strong></td></tr>
                    </table>
                </div>

                <p>During {his_her} tenure, <strong>{employee_name}</strong> worked with dedication and professionalism. {he_she_cap} demonstrated strong skills and maintained excellent relationships.</p>

                <p><strong>Key Responsibilities:</strong></p>
                <ul>
                    <li>{responsibility_1}</li>
                    <li>{responsibility_2}</li>
                    <li>{responsibility_3}</li>
                </ul>

                <p>We found {his_her} to be a {performance_rating} employee. {he_she_cap} left on <strong>{termination_date}</strong> due to <strong>{termination_reason}</strong>.</p>

                <p>We wish {him_her} success in {his_her} future endeavors.</p>

                <p>This certificate is issued for official purposes upon employee request.</p>

                <p>For verification, contact HR at {company_email} or {company_phone}.</p>

                <p style="margin-top: 25px;"><strong>Yours Faithfully,</strong></p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <table style="width: 100%;">
                    <tr>
                        <td width="45%" style="vertical-align: top;">
                            <div class="signature-line"></div>
                            <strong>{hr_manager_name}</strong><br>
                            HR Manager<br>
                            {company_name}
                        </td>
                        <td width="10%" style="text-align: center; vertical-align: top;">
                            <div style="border: 2px dashed #ccc; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; color: #999; font-size: 9px; margin-top: 10px;">
                                Seal
                            </div>
                        </td>
                        <td width="45%" style="text-align: right; vertical-align: top;">
                            <div class="signature-line" style="margin-left: auto;"></div>
                            <strong>{authorized_signatory_name}</strong><br>
                            {authorized_signatory_designation}<br>
                            {company_name}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <strong>{company_name}</strong> | {company_legal_name}<br>
            Tax ID: {company_tax_id} | Registration No: {company_registration_number}<br>
            Verification Code: <strong>{verification_code}</strong> | Verify at: {company_website}/verify<br>
            <span class="footer-mark">This is a digitally generated certificate.</span>
        </div>
    </div>
</body>
</html>`,

  // ========================================
  // NO OBJECTION CERTIFICATE (NOC) TEMPLATE
  // ========================================
  noc: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No Objection Certificate</title>
    <style>${COMMON_STYLES}</style>
</head>
<body>
    <div class="page">
        <!-- Header with Letterhead -->
        <div class="header">
            <div class="letterhead">
                <div class="logo-container">
                    <img src="{app_logo}" alt="{company_name}" class="logo" />
                </div>
                <div class="company-info">
                    <div class="company-name">{company_name}</div>
                    <div class="company-details">
                        {company_legal_name}<br>
                        {company_address}, {company_city}, {company_state} {company_postal_code}, {company_country}<br>
                        Phone: {company_phone} | Email: {company_email} | Website: {company_website}
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
            <!-- Reference & Date -->
            <div class="date-ref">
                <strong>Ref No:</strong> {reference_number}<br>
                <strong>Date:</strong> {issue_date}
            </div>

            <!-- Recipient -->
            <div class="recipient-address">
                <strong>To,</strong><br>
                {recipient_name}<br>
                {recipient_designation}<br>
                {recipient_organization}<br>
                {recipient_address}
            </div>

            <!-- Title -->
            <div class="document-title">
                NO OBJECTION CERTIFICATE
            </div>

            <!-- Subject -->
            <p><strong>Subject: No Objection Certificate for {employee_name}</strong></p>

            <!-- Content -->
            <div class="content">
                <p>Dear Sir/Madam,</p>

                <p>This certifies that <strong>{employee_name}</strong> (Employee ID: <strong>{employee_id}</strong>) is currently employed with <strong>{company_name}</strong> as <strong>{designation}</strong> in the <strong>{department}</strong> department.</p>

                <div class="info-box">
                    <strong>Employee Details:</strong>
                    <table>
                        <tr><td width="45%"><strong>Full Name:</strong></td><td>{employee_name}</td></tr>
                        <tr><td><strong>Employee ID:</strong></td><td>{employee_id}</td></tr>
                        <tr><td><strong>Designation:</strong></td><td>{designation}</td></tr>
                        <tr><td><strong>Department:</strong></td><td>{department}</td></tr>
                        <tr><td><strong>Joining Date:</strong></td><td>{joining_date}</td></tr>
                        <tr><td><strong>Employment Type:</strong></td><td>{employment_type}</td></tr>
                    </table>
                </div>

                <p><strong>{company_name}</strong> has <strong>NO OBJECTION</strong> to <strong>{employee_name}</strong> pursuing:</p>

                <div class="highlight-box">
                    <strong style="font-size: 13px; color: #1976d2;">{purpose}</strong>
                </div>

                <p><strong>Terms & Conditions:</strong></p>
                <ul>
                    <li>This activity should not interfere with work responsibilities at {company_name}.</li>
                    <li>Employee must maintain professional conduct and company reputation.</li>
                    <li>Commitments should not conflict with employment contract.</li>
                    <li>{additional_condition_1}</li>
                    <li>{additional_condition_2}</li>
                </ul>

                <p><strong>Validity:</strong> From <strong>{valid_from}</strong> to <strong>{valid_until}</strong> or until employment ends, whichever is earlier.</p>

                <p>This certificate is issued upon employee request for <strong>{purpose}</strong>.</p>

                <p>For verification, contact HR at {company_email} or {company_phone}.</p>

                <p style="margin-top: 25px;"><strong>Yours Sincerely,</strong></p>
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <table style="width: 100%;">
                    <tr>
                        <td width="45%" style="vertical-align: top;">
                            <div class="signature-line"></div>
                            <strong>{hr_manager_name}</strong><br>
                            HR Manager<br>
                            {company_name}
                        </td>
                        <td width="10%" style="text-align: center; vertical-align: top;">
                            <div style="border: 2px dashed #ccc; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; color: #999; font-size: 9px; margin-top: 10px;">
                                Seal
                            </div>
                        </td>
                        <td width="45%" style="text-align: right; vertical-align: top;">
                            <div class="signature-line" style="margin-left: auto;"></div>
                            <strong>{authorized_signatory_name}</strong><br>
                            {authorized_signatory_designation}<br>
                            {company_name}
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <strong>{company_name}</strong> | {company_legal_name}<br>
            Tax ID: {company_tax_id} | Registration No: {company_registration_number}<br>
            Reference: {reference_number} | Valid Until: {valid_until}<br>
            <span class="footer-mark">For verification, contact HR at {company_email}</span>
        </div>
    </div>
</body>
</html>`,
};

module.exports = PROFESSIONAL_TEMPLATES;
