import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Alert } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
// sections
import PDFFieldEditor from '../../sections/@dashboard/contract/PDFFieldEditor';
// services
import contractTemplateService from '../../services/api/contractTemplateService';
import templateFieldService from '../../services/api/templateFieldService';

// ----------------------------------------------------------------------

export default function TemplateFieldEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (id) {
      fetchTemplateAndFields();
    }
  }, [id]);

  const fetchTemplateAndFields = async () => {
    try {
      setLoading(true);
      
      // Fetch template details
      const response = await contractTemplateService.getById(id);
      
      // Extract template data from response
      const templateData = response.data || response;
      setTemplate(templateData);

      // Construct PDF URL
      if (templateData.filePath || templateData.file_path) {
        const filePath = templateData.filePath || templateData.file_path;
        const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${filePath}`;
        console.log('📄 Template filePath:', filePath);
        console.log('📄 Constructed PDF URL:', url);
        setPdfUrl(url);
      } else {
        console.error('❌ No filePath in template data:', templateData);
        enqueueSnackbar('PDF file path not found in template', { variant: 'error' });
      }

      // Fetch existing fields
      try {
        const fieldsData = await templateFieldService.getByTemplate(id);
        setFields(fieldsData);
      } catch (error) {
        // No fields yet, that's okay
        console.log('No existing fields:', error);
      }

    } catch (error) {
      console.error('Error fetching template:', error);
      enqueueSnackbar('Failed to load template', { variant: 'error' });
      navigate(PATH_DASHBOARD.contracts.templates);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFields = async (fieldsToSave) => {
    try {
      // Save fields to backend
      await templateFieldService.bulkUpdate(id, fieldsToSave);

      enqueueSnackbar('Fields saved successfully!', { variant: 'success' });
      navigate(PATH_DASHBOARD.contracts.templates);
    } catch (error) {
      console.error('Error saving fields:', error);
      enqueueSnackbar('Failed to save fields', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    navigate(PATH_DASHBOARD.contracts.templates);
  };

  if (loading) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Alert severity="info">Loading template...</Alert>
      </Container>
    );
  }

  if (!pdfUrl) {
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Alert severity="error">PDF file not found</Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Field Editor | {template?.name || 'Template'}</title>
      </Helmet>

      <Container maxWidth={false}>
        <CustomBreadcrumbs
          heading={`Edit Fields: ${template?.name || 'Template'}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'Templates', href: PATH_DASHBOARD.contracts.templates },
            { name: 'Field Editor' },
          ]}
          sx={{ mb: 2 }}
        />

        <PDFFieldEditor
          pdfUrl={pdfUrl}
          initialFields={fields}
          onSave={handleSaveFields}
          onCancel={handleCancel}
        />
      </Container>
    </>
  );
}

