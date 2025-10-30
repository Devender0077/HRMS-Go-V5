import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Container, Card, Stack, Button, Typography, Alert, TextField, LinearProgress } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';

export default function SplitPDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splitOption, setSplitOption] = useState('pages');

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSplit = async () => {
    if (!file) return;
    try {
      setLoading(true);
      // PDF split logic will be implemented
      enqueueSnackbar('PDF split successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to split PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Split PDF | PDF Tools</title></Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Split PDF"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Split' },
          ]}
          sx={{ mb: 3 }}
        />
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info">Split PDF into multiple files by page range or intervals</Alert>
            <Button variant="contained" component="label" startIcon={<Iconify icon="eva:upload-fill" />}>
              Select PDF File
              <input type="file" hidden accept=".pdf" onChange={handleFileSelect} />
            </Button>
            {file && (
              <>
                <Typography variant="subtitle2">{file.name}</Typography>
                <TextField
                  select
                  label="Split Option"
                  value={splitOption}
                  onChange={(e) => setSplitOption(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  <option value="pages">Every Page</option>
                  <option value="range">By Page Range</option>
                  <option value="interval">By Interval</option>
                </TextField>
                {loading && <LinearProgress />}
                <Button variant="contained" onClick={handleSplit} disabled={loading}>
                  Split PDF
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}

