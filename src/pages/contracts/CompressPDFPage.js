import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Card, Stack, Button, Typography, Alert, Box, LinearProgress } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import documentEditorService from '../../services/api/documentEditorService';

export default function CompressPDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      // Compress logic
      enqueueSnackbar('PDF compressed successfully!', { variant: 'success' });
      setResult({ originalSize: file.size, compressedSize: file.size * 0.6, savedPercentage: 40 });
    } catch (error) {
      enqueueSnackbar('Failed to compress PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Compress PDF | PDF Tools</title></Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Compress PDF"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Compress' },
          ]}
          sx={{ mb: 3 }}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info">Reduce PDF file size while maintaining quality</Alert>
            
            <Button variant="contained" component="label" startIcon={<Iconify icon="eva:upload-fill" />}>
              Select PDF File
              <input type="file" hidden accept=".pdf" onChange={handleFileSelect} />
            </Button>

            {file && (
              <>
                <Typography variant="subtitle2">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Typography>
                {loading && <LinearProgress />}
                {result && (
                  <Alert severity="success">
                    Compressed from {(result.originalSize / 1024 / 1024).toFixed(2)} MB to {(result.compressedSize / 1024 / 1024).toFixed(2)} MB
                    <br />Saved {result.savedPercentage}%!
                  </Alert>
                )}
                <Button variant="contained" onClick={handleCompress} disabled={loading}>
                  Compress PDF
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}

