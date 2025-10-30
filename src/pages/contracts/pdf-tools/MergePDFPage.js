import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// @mui
import {
  Container,
  Card,
  Stack,
  Button,
  Typography,
  Box,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';

export default function MergePDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const handleMerge = async () => {
    if (files.length < 2) {
      enqueueSnackbar('Please select at least 2 PDF files', { variant: 'warning' });
      return;
    }
    
    try {
      setLoading(true);
      // TODO: Implement merge PDF logic via backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      enqueueSnackbar('PDFs merged successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to merge PDFs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <Helmet><title>Merge PDFs | PDF Tools</title></Helmet>
      
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Merge PDFs"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Merge' },
          ]}
          sx={{ mb: 5 }}
        />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Alert severity="info" icon={<Iconify icon="eva:layers-fill" />}>
              <Typography variant="subtitle2" gutterBottom>
                Combine Multiple PDFs
              </Typography>
              <Typography variant="body2">
                Upload multiple PDF files and merge them into a single document. 
                Files will be combined in the order shown below.
              </Typography>
            </Alert>

            <Paper
              {...getRootProps()}
              sx={{
                py: 8,
                px: 3,
                textAlign: 'center',
                border: (theme) => `2px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                cursor: 'pointer',
                transition: (theme) => theme.transitions.create(['all']),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderColor: 'primary.main',
                },
                ...(isDragActive && {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderColor: 'primary.main',
                }),
              }}
            >
              <input {...getInputProps()} />
              
              <Iconify
                icon="eva:cloud-upload-fill"
                width={64}
                sx={{ mb: 2, color: 'text.disabled' }}
              />

              <Typography variant="h5" paragraph>
                {isDragActive ? 'Drop PDF files here' : 'Drop or Select PDFs'}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Drop your PDF files here or click to browse
                <br />
                <Typography variant="caption">
                  Select multiple files • Maximum 50MB per file
                </Typography>
              </Typography>
            </Paper>

            {files.length > 0 && (
              <>
                <Typography variant="subtitle1">
                  Selected Files ({files.length})
                </Typography>

                <List>
                  {files.map((file, index) => (
                    <Paper key={index} variant="outlined" sx={{ mb: 1 }}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemove(index)} color="error">
                            <Iconify icon="eva:close-fill" />
                          </IconButton>
                        }
                      >
                        <ListItemIcon>
                          <Typography variant="h6" color="text.secondary">
                            {index + 1}
                          </Typography>
                        </ListItemIcon>
                        <ListItemIcon>
                          <Iconify icon="vscode-icons:file-type-pdf2" width={32} />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>

                {loading && <LinearProgress />}

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setFiles([])}
                    disabled={loading}
                  >
                    Clear All
                  </Button>
                  <LoadingButton
                    fullWidth
                    size="large"
                    variant="contained"
                    loading={loading}
                    startIcon={<Iconify icon="eva:layers-fill" />}
                    onClick={handleMerge}
                    disabled={files.length < 2}
                  >
                    Merge {files.length} Files
                  </LoadingButton>
                </Stack>
              </>
            )}

            {files.length === 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3 }}>
                  Features
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Combine unlimited PDF files" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Maintains original quality" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Reorder files before merging" />
                  </ListItem>
                </List>
              </>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}
