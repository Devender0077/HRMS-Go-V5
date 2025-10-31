import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Document, Page, pdfjs } from 'react-pdf';
// @mui
import { 
  Box, 
  Typography, 
  TextField, 
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// services
import templateFieldService from '../../../services/api/templateFieldService';

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// ----------------------------------------------------------------------

ContractDocumentViewer.propTypes = {
  contractInstance: PropTypes.object,
  templateId: PropTypes.number,
  fieldValues: PropTypes.object,
  onFieldChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function ContractDocumentViewer({
  contractInstance,
  templateId,
  fieldValues = {},
  onFieldChange,
  disabled = false,
}) {
  const [numPages, setNumPages] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (templateId) {
      fetchTemplateFields();
    }
  }, [templateId]);

  useEffect(() => {
    if (contractInstance?.template?.filePath) {
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${contractInstance.template.filePath}`;
      setPdfUrl(url);
    }
  }, [contractInstance]);

  const fetchTemplateFields = async () => {
    try {
      setLoading(true);
      const response = await templateFieldService.getByTemplate(templateId);
      if (response.success && response.data) {
        setFields(response.data);
      }
    } catch (err) {
      console.error('Error fetching template fields:', err);
      setError('Failed to load contract fields');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err);
    setError('Failed to load contract document');
  };

  const handleFieldChange = (fieldId, value) => {
    if (onFieldChange) {
      onFieldChange(fieldId, value);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" icon={<Iconify icon="eva:alert-triangle-fill" />}>
        {error}
      </Alert>
    );
  }

  if (!pdfUrl) {
    return (
      <Alert severity="warning" icon={<Iconify icon="eva:info-fill" />}>
        No contract document available
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {fields.length > 0 && (
        <Alert severity="info" icon={<Iconify icon="eva:edit-2-fill" />}>
          Please fill in all required fields in the document below before signing
        </Alert>
      )}

      {/* PDF Document */}
      <Paper variant="outlined" sx={{ position: 'relative' }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Box key={`page_${index + 1}`} sx={{ position: 'relative', mb: 2 }}>
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={800}
              />
              
              {/* Render fields on this page */}
              {fields
                .filter(field => field.page_number === index + 1)
                .map(field => {
                  const { x_position, y_position, width, height } = field;
                  
                  return (
                    <Box
                      key={field.id}
                      sx={{
                        position: 'absolute',
                        left: `${x_position}%`,
                        top: `${y_position}%`,
                        width: width ? `${width}%` : '200px',
                        height: height ? `${height}%` : '30px',
                        zIndex: 10,
                      }}
                    >
                      {field.field_type === 'signature' ? (
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                            p: 1,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <Typography variant="caption" color="primary">
                            Signature field (sign at bottom)
                          </Typography>
                        </Box>
                      ) : field.field_type === 'date' ? (
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          value={fieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          disabled={disabled}
                          required={field.is_required}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            bgcolor: 'white',
                            '& input': {
                              padding: '8px',
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          size="small"
                          fullWidth
                          placeholder={field.field_label || field.field_type}
                          value={fieldValues[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          disabled={disabled}
                          required={field.is_required}
                          sx={{
                            bgcolor: 'white',
                            '& input': {
                              padding: '8px',
                            },
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
            </Box>
          ))}
        </Document>
      </Paper>

      {fields.length === 0 && (
        <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
          This contract has no fillable fields. Please proceed to sign below.
        </Alert>
      )}
    </Stack>
  );
}

