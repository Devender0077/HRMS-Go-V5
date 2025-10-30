import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Container,
  Card,
  Stack,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
// services
import documentEditorService from '../../../services/api/documentEditorService';

// ----------------------------------------------------------------------

export default function MergePDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      enqueueSnackbar('Please select at least 2 PDF files', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      // Upload and merge logic will go here
      enqueueSnackbar('PDFs merged successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to merge PDFs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Merge PDFs | PDF Tools</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Merge PDFs"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools', href: '/dashboard/contracts/pdf-tools' },
            { name: 'Merge' },
          ]}
          sx={{ mb: 3 }}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert severity="info">
              Combine multiple PDF files into a single document. Files will be merged in the order shown below.
            </Alert>

            <Button
              variant="contained"
              component="label"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Select PDF Files
              <input
                type="file"
                hidden
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </Button>

            {files.length > 0 && (
              <>
                <Typography variant="subtitle1">
                  Selected Files ({files.length})
                </Typography>

                <List>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleRemove(index)}>
                          <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      />
                    </ListItem>
                  ))}
                </List>

                {loading && <LinearProgress />}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setFiles([])}>
                    Clear All
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleMerge}
                    disabled={files.length < 2 || loading}
                    startIcon={<Iconify icon="eva:layers-fill" />}
                  >
                    Merge {files.length} Files
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}

