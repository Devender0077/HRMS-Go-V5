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

export default function DeletePagesPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleProcess = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      // TODO: Implement delete PDF logic via backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      enqueueSnackbar('Delete Pages completed successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to delete PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <>
      <Helmet><title>Delete Pages | PDF Tools</title></Helmet>
      
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Delete Pages"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Delete Pages' },
          ]}
          sx={{ mb: 5 }}
        />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Alert severity="info" icon={<Iconify icon="eva:trash-2-outline" />}>
              <Typography variant="subtitle2" gutterBottom>
                Delete Pages
              </Typography>
              <Typography variant="body2">
                Remove unwanted pages from your PDF document
              </Typography>
            </Alert>

            {!file && (
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
                  {isDragActive ? 'Drop PDF file here' : 'Drop or Select PDF'}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Drop your PDF file here or click to browse
                  <br />
                  <Typography variant="caption">Maximum file size: 50MB</Typography>
                </Typography>
              </Paper>
            )}

            {file && (
              <>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Iconify icon="vscode-icons:file-type-pdf2" width={48} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="eva:close-fill" />}
                      onClick={handleRemove}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Paper>

                {loading && <LinearProgress />}

                <LoadingButton
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={loading}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={handleProcess}
                >
                  Delete Pages
                </LoadingButton>
              </>
            )}

            {!file && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3 }}>
                  Features
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Select pages to remove" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Delete multiple pages at once" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Preview before deletion" />
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
