import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
// services
import contractTemplateService from '../../services/api/contractTemplateService';
import contractInstanceService from '../../services/api/contractInstanceService';
import employeeService from '../../services/api/employeeService';

// ----------------------------------------------------------------------

export default function SendContractPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [templates, setTemplates] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    templateId: searchParams.get('templateId') || '',
    recipientType: 'employee',
    recipientId: '',
    recipientEmail: '',
    recipientName: '',
    expiresInDays: '7',
    title: '',
  });

  useEffect(() => {
    fetchTemplates();
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Auto-fill title when template is selected
    if (formData.templateId) {
      const selectedTemplate = templates.find(t => t.id === parseInt(formData.templateId));
      if (selectedTemplate && !formData.title) {
        setFormData(prev => ({ ...prev, title: selectedTemplate.name }));
      }
    }
  }, [formData.templateId, templates]);

  useEffect(() => {
    // Auto-fill email and name when employee is selected
    if (formData.recipientType === 'employee' && formData.recipientId) {
      const selectedEmployee = employees.find(e => e.id === parseInt(formData.recipientId));
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          recipientEmail: selectedEmployee.email || '',
          recipientName: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
        }));
      }
    }
  }, [formData.recipientId, formData.recipientType, employees]);

  const fetchTemplates = async () => {
    try {
      const response = await contractTemplateService.getAll({ limit: 100, status: 'active' });
      if (response.success) {
        setTemplates(response.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getForDropdown();
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching employees:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.templateId) {
      enqueueSnackbar('Please select a template', { variant: 'warning' });
      return;
    }

    if (formData.recipientType === 'employee' && !formData.recipientId) {
      enqueueSnackbar('Please select an employee', { variant: 'warning' });
      return;
    }

    if (!formData.recipientEmail) {
      enqueueSnackbar('Please provide recipient email', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);

      const response = await contractInstanceService.create({
        templateId: parseInt(formData.templateId),
        title: formData.title,
        recipientType: formData.recipientType,
        recipientId: formData.recipientId ? parseInt(formData.recipientId) : null,
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        expiresInDays: parseInt(formData.expiresInDays),
      });

      if (response.success) {
        enqueueSnackbar('Contract created successfully', { variant: 'success' });

        // Ask if user wants to send now
        if (window.confirm('Contract created! Would you like to send it now?')) {
          const sendResponse = await contractInstanceService.send(response.data.id);
          if (sendResponse.success) {
            enqueueSnackbar('Contract sent successfully!', { variant: 'success' });
          }
        }

        navigate('/dashboard/contracts/instances');
      } else {
        enqueueSnackbar(response.message || 'Failed to create contract', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Error creating contract:', error);
      enqueueSnackbar('Error creating contract', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === parseInt(formData.templateId));

  return (
    <>
      <Helmet>
        <title> Send Contract | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Send Contract"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: 'Send' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Contract Details</Typography>

            {/* Template Selection */}
            <TextField
              select
              fullWidth
              label="Select Template"
              value={formData.templateId}
              onChange={(e) => handleChange('templateId', e.target.value)}
              required
              SelectProps={{ native: false }}
            >
              <MenuItem value="">-- Select Template --</MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.region === 'usa' && '🇺🇸 '}
                  {template.region === 'india' && '🇮🇳 '}
                  {template.region === 'global' && '🌍 '}
                  {template.name}
                </MenuItem>
              ))}
            </TextField>

            {selectedTemplate && (
              <Alert severity="info">
                <Typography variant="subtitle2">Template Info</Typography>
                <Typography variant="caption" display="block">
                  Category: {selectedTemplate.category} | Region: {selectedTemplate.region}
                </Typography>
                {selectedTemplate.description && (
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    {selectedTemplate.description}
                  </Typography>
                )}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Contract Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Employment Agreement - John Doe"
              required
            />

            <Divider />

            <Typography variant="h6">Recipient Details</Typography>

            {/* Recipient Type */}
            <TextField
              select
              fullWidth
              label="Recipient Type"
              value={formData.recipientType}
              onChange={(e) => handleChange('recipientType', e.target.value)}
              SelectProps={{ native: false }}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            {/* Employee Selection */}
            {formData.recipientType === 'employee' && (
              <TextField
                select
                fullWidth
                label="Select Employee"
                value={formData.recipientId}
                onChange={(e) => handleChange('recipientId', e.target.value)}
                required
                SelectProps={{ native: false }}
              >
                <MenuItem value="">-- Select Employee --</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} - {emp.employee_id}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* Manual Email/Name for non-employees */}
            {formData.recipientType !== 'employee' && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Recipient Name"
                    value={formData.recipientName}
                    onChange={(e) => handleChange('recipientName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Recipient Email"
                    value={formData.recipientEmail}
                    onChange={(e) => handleChange('recipientEmail', e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            )}

            {/* Auto-filled email for employees */}
            {formData.recipientType === 'employee' && formData.recipientEmail && (
              <Alert severity="success" icon={<Iconify icon="eva:checkmark-circle-2-fill" />}>
                Will be sent to: {formData.recipientEmail}
              </Alert>
            )}

            <Divider />

            <Typography variant="h6">Settings</Typography>

            <TextField
              select
              fullWidth
              label="Expires In"
              value={formData.expiresInDays}
              onChange={(e) => handleChange('expiresInDays', e.target.value)}
              SelectProps={{ native: false }}
              helperText="Contract will expire after this many days"
            >
              <MenuItem value="3">3 days</MenuItem>
              <MenuItem value="7">7 days (recommended)</MenuItem>
              <MenuItem value="14">14 days</MenuItem>
              <MenuItem value="30">30 days</MenuItem>
              <MenuItem value="60">60 days</MenuItem>
            </TextField>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/contracts/instances')}
                disabled={submitting}
              >
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:paper-plane-fill" />}
                onClick={handleSubmit}
                loading={submitting}
              >
                Create & Send Contract
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </>
  );
}

