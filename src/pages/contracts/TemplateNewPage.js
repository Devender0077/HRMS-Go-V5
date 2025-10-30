import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Box,
  Alert,
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

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS = [
  { value: 'employee', label: 'Employee Documents' },
  { value: 'vendor', label: 'Vendor Contracts' },
  { value: 'msa', label: 'Master Service Agreement' },
  { value: 'po', label: 'Purchase Order' },
  { value: 'sow', label: 'Statement of Work' },
  { value: 'nda', label: 'NDA' },
  { value: 'other', label: 'Other' },
];

const REGION_OPTIONS = [
  { value: 'usa', label: '🇺🇸 USA' },
  { value: 'india', label: '🇮🇳 India' },
  { value: 'global', label: '🌍 Global' },
];

// ----------------------------------------------------------------------

export default function TemplateNewPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'employee',
    region: 'global',
    isActive: true,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        enqueueSnackbar('Please select a PDF or Word document', { variant: 'error' });
        return;
      }

      // Validate file size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        enqueueSnackbar('File size must be less than 20MB', { variant: 'error' });
        return;
      }

      setSelectedFile(file);
      console.log('📎 File selected:', file.name, file.size, 'bytes');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      enqueueSnackbar('Please enter a template name', { variant: 'warning' });
      return;
    }

    if (!selectedFile) {
      enqueueSnackbar('Please select a template file', { variant: 'warning' });
      return;
    }

    try {
      setSubmitting(true);

      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('region', formData.region);
      uploadData.append('isActive', formData.isActive);
      uploadData.append('templateFile', selectedFile);

      console.log('📤 Uploading template:', formData.name);

      const response = await contractTemplateService.create(uploadData);

      if (response.success) {
        enqueueSnackbar('Template created successfully!', { variant: 'success' });
        navigate('/dashboard/contracts/templates');
      } else {
        enqueueSnackbar(response.message || 'Failed to create template', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ Error creating template:', error);
      enqueueSnackbar('Error creating template', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> New Template | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Upload New Template"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: 'Templates', href: '/dashboard/contracts/templates' },
            { name: 'New' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Template Information</Typography>

            <TextField
              fullWidth
              label="Template Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Employment Agreement - USA"
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of this template..."
            />

            <TextField
              select
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              SelectProps={{ native: false }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              required
              SelectProps={{ native: false }}
            >
              {REGION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Template File
              </Typography>

              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                sx={{ height: 120, borderStyle: 'dashed' }}
              >
                {selectedFile ? (
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="eva:file-fill" sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">{selectedFile.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  </Stack>
                ) : (
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="eva:cloud-upload-fill" sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">Upload PDF or Word Document</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Max file size: 20MB
                    </Typography>
                  </Stack>
                )}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                />
              </Button>

              {selectedFile && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  File ready to upload: {selectedFile.name}
                </Alert>
              )}
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard/contracts/templates')}
                disabled={submitting}
              >
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                onClick={handleSubmit}
                loading={submitting}
                disabled={!formData.name.trim() || !selectedFile}
              >
                Upload Template
              </LoadingButton>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </>
  );
}

