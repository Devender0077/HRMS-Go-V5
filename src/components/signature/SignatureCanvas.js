import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import SignatureCanvasLib from 'react-signature-canvas';
// @mui
import { Box, Button, Stack, Paper, Typography, Tabs, Tab, TextField } from '@mui/material';
// components
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const SignatureCanvas = forwardRef(({ onSave, disabled = false }, ref) => {
  const signaturePadRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('draw');
  const [typedText, setTypedText] = useState('');

  useImperativeHandle(ref, () => ({
    clear: () => {
      signaturePadRef.current?.clear();
      setTypedText('');
    },
    isEmpty: () => {
      if (currentTab === 'draw') {
        return signaturePadRef.current?.isEmpty() ?? true;
      }
      return !typedText.trim();
    },
    getSignatureData: () => {
      if (currentTab === 'draw') {
        return signaturePadRef.current?.toDataURL();
      }
      // For typed signature, generate a signature-style canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.font = '36px "Brush Script MT", cursive';
      ctx.fillStyle = '#000000';
      ctx.fillText(typedText, 20, 60);
      return canvas.toDataURL();
    },
  }));

  const handleClear = () => {
    if (currentTab === 'draw') {
      signaturePadRef.current?.clear();
    } else {
      setTypedText('');
    }
  };

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
        </Tabs>

        {currentTab === 'draw' && (
          <Box
            sx={{
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'background.neutral',
            }}
          >
            <SignatureCanvasLib
              ref={signaturePadRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas',
                style: { width: '100%', height: 200 },
              }}
              backgroundColor="rgb(255,255,255)"
              penColor="rgb(0,0,0)"
            />
          </Box>
        )}

        {currentTab === 'type' && (
          <TextField
            fullWidth
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your full name"
            disabled={disabled}
            sx={{
              '& input': {
                fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                fontSize: 32,
                textAlign: 'center',
              },
            }}
          />
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

