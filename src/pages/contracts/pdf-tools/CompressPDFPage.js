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
  Slider,
  FormControlLabel,
  Radio,
  RadioGroup,
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

export default function CompressPDFPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleCompress = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      // TODO: Implement compress PDF logic via backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate compression result
      const savings = compressionLevel === 'high' ? 60 : compressionLevel === 'medium' ? 40 : 20;
      setResult({
        originalSize: file.size,
        compressedSize: file.size * (1 - savings / 100),
        savedPercentage: savings,
      });
      
      enqueueSnackbar('PDF compressed successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to compress PDF', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setResult(null);
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
          sx={{ mb: 5 }}
        />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Alert severity="info" icon={<Iconify icon="eva:archive-outline" />}>
              <Typography variant="subtitle2" gutterBottom>
                Reduce PDF File Size
              </Typography>
              <Typography variant="body2">
                Compress your PDF to reduce file size while maintaining quality. 
                Choose from different compression levels based on your needs.
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
                        Original size: {(file.size / 1024 / 1024).toFixed(2)} MB
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

                <Typography variant="subtitle2">Compression Level</Typography>
                
                <RadioGroup
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                >
                  <FormControlLabel
                    value="low"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">Low Compression</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Best quality, larger file size (~20% reduction)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="medium"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">Medium Compression (Recommended)</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Good balance between quality and size (~40% reduction)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">High Compression</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Smaller file size, may reduce quality (~60% reduction)
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>

                {result && (
                  <Alert severity="success">
                    <Typography variant="subtitle2" gutterBottom>
                      Compression Complete!
                    </Typography>
                    <Typography variant="body2">
                      Original: {(result.originalSize / 1024 / 1024).toFixed(2)} MB
                      <br />
                      Compressed: {(result.compressedSize / 1024 / 1024).toFixed(2)} MB
                      <br />
                      <strong>Saved {result.savedPercentage}%</strong> ({((result.originalSize - result.compressedSize) / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  </Alert>
                )}

                {loading && <LinearProgress />}

                <LoadingButton
                  fullWidth
                  size="large"
                  variant="contained"
                  loading={loading}
                  startIcon={<Iconify icon="eva:archive-outline" />}
                  onClick={handleCompress}
                >
                  Compress PDF
                </LoadingButton>

                {result && (
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<Iconify icon="eva:download-outline" />}
                  >
                    Download Compressed PDF
                  </Button>
                )}
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
                    <ListItemText primary="Multiple compression levels" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="Maintains document quality" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={24} />
                    </ListItemIcon>
                    <ListItemText primary="See compression statistics" />
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
