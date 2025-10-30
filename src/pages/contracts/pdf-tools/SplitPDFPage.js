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
  Alert,
  TextField,
  MenuItem,
  Box,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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

export default function SplitPDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splitOption, setSplitOption] = useState('all');
  const [pageRange, setPageRange] = useState('');

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

  const handleSplit = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      // TODO: Implement PDF split logic via backend API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      enqueueSnackbar('PDF split successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to split PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
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
          sx={{ mb: 5 }}
        />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Instructions */}
            <Alert severity="info" icon={<Iconify icon="eva:info-outline" />}>
              <Typography variant="subtitle2" gutterBottom>
                Split PDF into Multiple Files
              </Typography>
              <Typography variant="body2">
                Choose how you want to split your PDF: all pages, custom range, or by intervals. 
                Each page or group will be saved as a separate file.
              </Typography>
            </Alert>

            {/* Upload Area */}
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
                  sx={{
                    mb: 2,
                    color: 'text.disabled',
                  }}
                />

                <Typography variant="h5" paragraph>
                  {isDragActive ? 'Drop PDF file here' : 'Drop or Select PDF'}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Drop your PDF file here or click to browse
                  <br />
                  <Typography variant="caption">
                    Maximum file size: 50MB
                  </Typography>
                </Typography>
              </Paper>
            )}

            {/* File Info & Options */}
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

                <Divider />

                <Typography variant="subtitle1">Split Options</Typography>

                <TextField
                  select
                  fullWidth
                  label="How to Split"
                  value={splitOption}
                  onChange={(e) => setSplitOption(e.target.value)}
                >
                  <MenuItem value="all">Split Every Page</MenuItem>
                  <MenuItem value="range">Split by Page Range</MenuItem>
                  <MenuItem value="interval">Split by Interval</MenuItem>
                  <MenuItem value="size">Split by File Size</MenuItem>
                </TextField>

                {splitOption === 'range' && (
                  <TextField
                    fullWidth
                    label="Page Ranges"
                    placeholder="e.g., 1-5, 6-10, 11-15"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    helperText="Enter page ranges separated by commas"
                  />
                )}

                {splitOption === 'interval' && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Pages per File"
                    defaultValue="5"
                    helperText="Number of pages in each split file"
                  />
                )}

                {loading && <LinearProgress />}

                <LoadingButton
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={loading}
                  startIcon={<Iconify icon="eva:scissors-outline" />}
                  onClick={handleSplit}
                >
                  Split PDF
                </LoadingButton>
              </>
            )}

            {/* Features List */}
            {!file && (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Multiple Split Options"
                    secondary="Split by pages, ranges, intervals, or file size"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Maintains Quality"
                    secondary="No loss in PDF quality during splitting"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Batch Download"
                    secondary="Download all split files as ZIP"
                  />
                </ListItem>
              </List>
            )}
          </Stack>
        </Card>
      </Container>
    </>
  );
}
