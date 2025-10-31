import { useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import PropTypes from 'prop-types';
import SignatureCanvasLib from 'react-signature-canvas';
// @mui
import { 
  Box, 
  Button, 
  Stack, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
// components
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const SIGNATURE_FONTS = [
  { value: 'cursive', label: 'Cursive', font: '"Brush Script MT", "Segoe Script", cursive' },
  { value: 'dancing', label: 'Dancing Script', font: '"Dancing Script", cursive' },
  { value: 'pacifico', label: 'Pacifico', font: '"Pacifico", cursive' },
  { value: 'great-vibes', label: 'Great Vibes', font: '"Great Vibes", cursive' },
  { value: 'allura', label: 'Allura', font: '"Allura", cursive' },
  { value: 'sacramento', label: 'Sacramento', font: '"Sacramento", cursive' },
  { value: 'satisfy', label: 'Satisfy', font: '"Satisfy", cursive' },
  { value: 'alex-brush', label: 'Alex Brush', font: '"Alex Brush", cursive' },
];

const SignatureCanvas = forwardRef(({ onSave, disabled = false }, ref) => {
  const signaturePadRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('draw');
  const [typedText, setTypedText] = useState('');
  const [selectedFont, setSelectedFont] = useState('cursive');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      signaturePadRef.current?.clear();
      setTypedText('');
      setUploadedImage(null);
      setUploadedImageUrl(null);
    },
    isEmpty: () => {
      if (currentTab === 'draw') {
        return signaturePadRef.current?.isEmpty() ?? true;
      }
      if (currentTab === 'type') {
        return !typedText.trim();
      }
      if (currentTab === 'upload') {
        return !uploadedImage;
      }
      return true;
    },
    getSignatureData: () => {
      if (currentTab === 'draw') {
        return signaturePadRef.current?.toDataURL();
      }
      if (currentTab === 'type') {
        // For typed signature, generate a signature-style canvas
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        const selectedFontObj = SIGNATURE_FONTS.find(f => f.value === selectedFont);
        ctx.font = `48px ${selectedFontObj?.font || 'cursive'}`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedText, 250, 75);
        return canvas.toDataURL();
      }
      if (currentTab === 'upload' && uploadedImage) {
        return uploadedImageUrl;
      }
      return null;
    },
  }));

  const handleClear = () => {
    if (currentTab === 'draw') {
      signaturePadRef.current?.clear();
    } else if (currentTab === 'type') {
      setTypedText('');
    } else if (currentTab === 'upload') {
      setUploadedImage(null);
      setUploadedImageUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageUrl(e.target?.result);
        setUploadedImage(file);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSave = () => {
    if (ref && onSave) {
      const signatureData = ref.current?.getSignatureData();
      if (signatureData) {
        onSave(signatureData);
      }
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle2">Sign Here</Typography>

        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
          <Tab
            icon={<Iconify icon="eva:edit-2-fill" />}
            label="Draw"
            value="draw"
            iconPosition="start"
          />
          <Tab
            icon={<Iconify icon="eva:text-fill" />}
            label="Type"
            value="type"
            iconPosition="start"
          />
          <Tab
            icon={<Iconify icon="eva:cloud-upload-fill" />}
            label="Upload"
            value="upload"
            iconPosition="start"
          />
        </Tabs>

        {currentTab === 'draw' && (
          <Stack spacing={2}>
            <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
              Use your mouse or touchscreen to draw your signature in the box below
            </Alert>
            <Box
              sx={{
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              <SignatureCanvasLib
                ref={signaturePadRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas',
                  style: { width: '100%', height: 200, cursor: 'crosshair' },
                }}
                backgroundColor="rgb(255,255,255)"
                penColor="rgb(0,0,0)"
                minWidth={0.5}
                maxWidth={2.5}
              />
            </Box>
          </Stack>
        )}

        {currentTab === 'type' && (
          <Stack spacing={2}>
            <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
              Type your full name and select your preferred font style
            </Alert>
            <FormControl fullWidth>
              <InputLabel>Signature Font</InputLabel>
              <Select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                label="Signature Font"
                disabled={disabled}
              >
                {SIGNATURE_FONTS.map((font) => (
                  <MenuItem key={font.value} value={font.value}>
                    <Typography sx={{ fontFamily: font.font, fontSize: 20 }}>
                      {font.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Type your full name"
              disabled={disabled}
              sx={{
                '& input': {
                  fontFamily: SIGNATURE_FONTS.find(f => f.value === selectedFont)?.font || 'cursive',
                  fontSize: 36,
                  textAlign: 'center',
                  padding: '20px',
                },
              }}
            />
            {typedText && (
              <Box
                sx={{
                  p: 2,
                  border: (theme) => `1px dashed ${theme.palette.divider}`,
                  borderRadius: 1,
                  textAlign: 'center',
                  bgcolor: 'background.neutral',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: SIGNATURE_FONTS.find(f => f.value === selectedFont)?.font || 'cursive',
                    fontSize: 42,
                  }}
                >
                  {typedText}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Preview
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {currentTab === 'upload' && (
          <Stack spacing={2}>
            <Alert severity="info" icon={<Iconify icon="eva:info-fill" />}>
              Upload an image of your signature (JPG, PNG, max 5MB)
            </Alert>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="eva:cloud-upload-fill" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              sx={{ py: 2 }}
            >
              Choose Image File
            </Button>
            {uploadedImageUrl && (
              <Box
                sx={{
                  p: 2,
                  border: (theme) => `2px solid ${theme.palette.success.main}`,
                  borderRadius: 1,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <img
                  src={uploadedImageUrl}
                  alt="Signature"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {uploadedImage?.name}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<Iconify icon="eva:refresh-fill" />}
            onClick={handleClear}
            disabled={disabled}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
});

SignatureCanvas.propTypes = {
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SignatureCanvas;

