import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
// components
import Iconify from '../iconify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function ImageUpload({ value, onChange, label, helperText, type = 'image' }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(value || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/x-icon'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, SVG, ICO)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload file
      const response = await axios.post(`${API_URL}/upload/single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const fileUrl = response.data.file.url;
        setPreview(fileUrl);
        onChange(fileUrl); // Update parent component
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getDisplayUrl = () => {
    if (preview && preview.startsWith('/uploads')) {
      return `${API_URL.replace('/api', '')}${preview}`;
    }
    return preview;
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.ico"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Stack spacing={2}>
        {label && (
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
        )}

        {/* Preview */}
        {preview && (
          <Box
            sx={{
              position: 'relative',
              width: type === 'favicon' ? 48 : 120,
              height: type === 'favicon' ? 48 : 120,
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Avatar
              src={getDisplayUrl()}
              alt={label}
              variant="rounded"
              sx={{
                width: '100%',
                height: '100%',
                '& img': {
                  objectFit: type === 'favicon' ? 'contain' : 'cover',
                },
              }}
            />
            <IconButton
              onClick={handleRemove}
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'error.lighter',
                  color: 'error.main',
                },
              }}
            >
              <Iconify icon="eva:close-fill" width={16} />
            </IconButton>
          </Box>
        )}

        {/* Upload Button */}
        <Stack direction="row" spacing={2}>
          <Button
            variant={preview ? 'outlined' : 'contained'}
            startIcon={
              uploading ? (
                <CircularProgress size={20} />
              ) : (
                <Iconify icon={preview ? 'eva:edit-fill' : 'eva:cloud-upload-fill'} />
              )
            }
            onClick={handleButtonClick}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : preview ? 'Change' : 'Upload'}
          </Button>

          {preview && (
            <Button variant="outlined" color="error" onClick={handleRemove} startIcon={<Iconify icon="eva:trash-2-fill" />}>
              Remove
            </Button>
          )}
        </Stack>

        {/* Helper Text */}
        {helperText && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {helperText}
          </Typography>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Preview URL */}
        {preview && (
          <Typography variant="caption" sx={{ color: 'text.disabled', wordBreak: 'break-all' }}>
            {preview}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

ImageUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.string,
  type: PropTypes.oneOf(['image', 'favicon', 'logo']),
};

