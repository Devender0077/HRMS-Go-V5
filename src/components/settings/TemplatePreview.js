import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
// components
import Iconify from '../iconify';

// ----------------------------------------------------------------------

// Sample data for template preview
const SAMPLE_DATA = {
  // Company Information
  company_name: 'HRMS Technologies Inc.',
  company_legal_name: 'HRMS Technologies Incorporated',
  company_address: '123 Business Avenue, Suite 100',
  company_city: 'New York',
  company_state: 'NY',
  company_postal_code: '10001',
  company_phone: '+1 (555) 123-4567',
  company_email: 'contact@hrms.com',
  company_website: 'https://www.hrmstech.com',
  company_tax_id: '12-3456789',
  company_registration_number: 'REG-2024-001',
  
  // Employee Information
  employee_name: 'John Doe',
  employee_id: 'EMP001',
  employee_address: '123 Main Street',
  employee_city: 'Los Angeles',
  employee_state: 'CA',
  employee_postal_code: '90001',
  employee_email: 'john.doe@hrmsgo.com',
  
  // Employment Details
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  branch: 'Headquarters - New York',
  employment_type: 'Full Time',
  joining_date: 'January 15, 2024',
  termination_date: 'December 31, 2025',
  last_designation: 'Senior Software Engineer',
  total_experience: '1 year 11 months',
  
  // Manager Information
  manager_name: 'Jane Smith',
  manager_designation: 'Engineering Manager',
  
  // HR Information
  hr_manager_name: 'Sarah Williams',
  hr_contact_person: 'Sarah Williams',
  hr_contact_phone: '+1 (555) 123-4570',
  
  // Salary Details
  currency_symbol: '$',
  annual_ctc: '120,000',
  monthly_salary: '10,000',
  basic_salary: '8,000',
  
  // Work Details
  shift: 'Morning Shift (9:00 AM - 6:00 PM)',
  work_hours: '9',
  probation_period: '3',
  annual_leave_days: '15',
  sick_leave_days: '10',
  
  // Dates
  issue_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  response_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  reporting_time: '9:00 AM',
  work_email: 'john.doe@hrmsgo.com',
  
  // Certificate Specific
  certificate_number: 'CERT-2024-001',
  verification_code: 'VERIFY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  authorized_signatory_name: 'Michael Johnson',
  authorized_signatory_designation: 'Chief Executive Officer',
  
  // NOC Specific
  reference_number: 'NOC/HR/2024/001',
  purpose: 'Pursuing Higher Education / Professional Certification',
  recipient_name: 'The Admissions Officer',
  recipient_designation: 'Head of Admissions',
  recipient_organization: 'University/Institution Name',
  recipient_address: 'Address of Institution',
  valid_from: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  additional_condition_1: 'The employee shall inform the company in advance about the schedule.',
  additional_condition_2: 'This NOC does not constitute permission for extended leave without prior approval.',
  
  // Performance & Responsibilities
  performance_rating: 'highly valued',
  responsibility_1: 'Leading software development projects and managing technical teams',
  responsibility_2: 'Architecting scalable solutions and implementing best practices',
  responsibility_3: 'Mentoring junior developers and conducting code reviews',
  termination_reason: 'Better Career Opportunity / Personal Reasons',
  
  // Pronouns (for dynamic text)
  he_she: 'he',
  He_she_cap: 'He',
  his_her: 'his',
  his_her_cap: 'His',
  him_her: 'him',
};

// ----------------------------------------------------------------------

TemplatePreview.propTypes = {
  template: PropTypes.string,
  templateType: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function TemplatePreview({ template, templateType, open, onClose }) {
  const [scale, setScale] = useState(0.8);

  // Replace template variables with sample data
  const previewHTML = useMemo(() => {
    if (!template) return '';
    
    let html = template;
    
    // Replace all variables in the format {variable_name}
    Object.keys(SAMPLE_DATA).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      html = html.replace(regex, SAMPLE_DATA[key]);
    });
    
    return html;
  }, [template]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(0.8);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(previewHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const getTemplateTitle = () => {
    const titles = {
      offer_letter_template: 'Offer Letter',
      joining_letter_template: 'Joining Letter',
      experience_certificate_template: 'Experience Certificate',
      noc_template: 'No Objection Certificate',
    };
    return titles[templateType] || 'Template Preview';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="eva:eye-fill" width={24} />
            <Typography variant="h6">{getTemplateTitle()} - Preview</Typography>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
                <Iconify icon="eva:minus-circle-outline" />
              </IconButton>
            </Tooltip>
            
            <Typography variant="body2" sx={{ px: 2, py: 1 }}>
              {Math.round(scale * 100)}%
            </Typography>
            
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn} disabled={scale >= 1.5}>
                <Iconify icon="eva:plus-circle-outline" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset Zoom">
              <IconButton onClick={handleReset}>
                <Iconify icon="eva:refresh-outline" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Print Preview">
              <IconButton onClick={handlePrint} color="primary">
                <Iconify icon="eva:printer-outline" />
              </IconButton>
            </Tooltip>
            
            <IconButton onClick={onClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Preview Mode:</strong> This shows how the template will look with sample data. 
          Variables like <code>{'{employee_name}'}</code>, <code>{'{designation}'}</code>, etc. are replaced with actual values when generating documents.
        </Alert>

        <Box
          sx={{
            bgcolor: '#f5f5f5',
            p: 3,
            borderRadius: 1,
            overflow: 'auto',
            minHeight: '500px',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              p: 4,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minHeight: '800px',
            }}
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Available Variables:</strong> {'{employee_name}'}, {'{employee_id}'}, {'{designation}'}, {'{department}'}, 
            {'{branch}'}, {'{joining_date}'}, {'{manager_name}'}, {'{company_name}'}, {'{company_address}'}, 
            {'{annual_ctc}'}, {'{monthly_salary}'}, and many more...
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handlePrint}
          startIcon={<Iconify icon="eva:printer-outline" />}
          variant="outlined"
        >
          Print Preview
        </Button>
        <Button onClick={onClose} variant="contained">
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
}

