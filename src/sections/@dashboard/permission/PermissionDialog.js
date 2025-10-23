import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
// utils
import permissionService from '../../../services/permissionService';

// ----------------------------------------------------------------------

PermissionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  permission: PropTypes.object,
};

export default function PermissionDialog({ open, onClose, onSuccess, permission }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    module: '',
    description: '',
    status: true,
  });

  const [loading, setLoading] = useState(false);

  const isEdit = !!permission;

  const modules = useMemo(
    () => [
      'Dashboard',
      'Employees',
      'Attendance',
      'Leaves',
      'Payroll',
      'Recruitment',
      'Performance',
      'Training',
      'Documents',
      'Assets',
      'Finance',
      'Reports',
      'Settings',
      'Announcements',
      'Calendar',
      'Messenger',
      'System',
    ],
    []
  );

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || '',
        slug: permission.slug || '',
        module: permission.module || '',
        description: permission.description || '',
        status: permission.status === 'active',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        module: '',
        description: '',
        status: true,
      });
    }
  }, [permission]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? checked : value,
    }));

    // Auto-generate slug from name
    if (name === 'name' && !isEdit) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = {
        ...formData,
        status: formData.status ? 'active' : 'inactive',
      };

      if (isEdit) {
        await permissionService.updatePermission(permission.id, data);
      } else {
        await permissionService.createPermission(data);
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving permission:', error);
      alert(error.message || 'Failed to save permission');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
      module: '',
      description: '',
      status: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Permission Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., View Employees"
            required
          />

          <TextField
            fullWidth
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="e.g., view-employees"
            helperText="Auto-generated from name, but you can customize"
            required
          />

          <TextField
            fullWidth
            select
            label="Module"
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
          >
            {modules.map((module) => (
              <MenuItem key={module} value={module}>
                {module}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this permission allows"
          />

          <FormControlLabel
            control={<Switch checked={formData.status} onChange={handleChange} name="status" />}
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.slug || !formData.module}
        >
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

