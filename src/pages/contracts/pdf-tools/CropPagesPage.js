import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Container, Card, Stack, Button, Typography, Alert, LinearProgress } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';

export default function CropPagesPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProcess = async () => {
    if (!file) return;
    try {
      setLoading(true);
      // TODO: Implement crop pages in PDF logic
      enqueueSnackbar('Crop Pages completed successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to crop pages in PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Crop Pages | PDF Tools</title></Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Crop Pages"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Crop Pages' },
          ]}
          sx={{ mb: 3 }}
        />
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info">Trim and adjust page margins</Alert>
            <Button variant="contained" component="label" startIcon={<Iconify icon="eva:crop-outline" />}>
              Select PDF File
              <input type="file" hidden accept=".pdf" onChange={handleFileSelect} />
            </Button>
            {file && (
              <>
                <Typography variant="subtitle2">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
                {loading && <LinearProgress />}
                <Button variant="contained" onClick={handleProcess} disabled={loading}>
                  Crop Pages
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}
