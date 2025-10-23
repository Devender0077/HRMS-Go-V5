import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  Box,
  Checkbox,
  FormGroup,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// services
import roleService from '../../../services/roleService';
import permissionService from '../../../services/permissionService';

// ----------------------------------------------------------------------

RoleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default function RoleDialog({ open, onClose, role, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(role);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
  });
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPermissions();
      if (role) {
        setFormData({
          name: role.name || '',
          description: role.description || '',
          status: role.status || 'active',
        });
        fetchRolePermissions(role.id);
      } else {
        setFormData({
          name: '',
          description: '',
          status: 'active',
        });
        setSelectedPermissions([]);
      }
    }
  }, [open, role]);

  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await permissionService.getAllPermissions();
      if (response.success) {
        setAllPermissions(response.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await roleService.getRoleById(roleId);
      if (response.success && response.data.permissions) {
        setSelectedPermissions(response.data.permissions.map(p => p.id));
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = {
        ...formData,
        permissions: selectedPermissions,
      };

      let response;
      if (isEdit) {
        response = await roleService.updateRole(role.id, data);
      } else {
        response = await roleService.createRole(data);
      }

      if (response.success) {
        enqueueSnackbar(isEdit ? 'Role updated successfully' : 'Role created successfully', {
          variant: 'success',
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving role:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error saving role', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by module
  const permissionsByModule = allPermissions.reduce((acc, permission) => {
    const module = permission.module || 'Other';
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(permission);
    return acc;
  }, {});

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Role' : 'Create New Role'}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {/* Basic Information */}
          <TextField
            fullWidth
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            helperText="e.g., Department Manager, Team Lead"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="Describe the role's responsibilities"
          />

          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>

          <Divider />

          {/* Permissions */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Assign Permissions
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Select the permissions this role should have
            </Typography>

            {loadingPermissions ? (
              <Typography variant="body2" color="text.secondary">Loading permissions...</Typography>
            ) : (
              <Stack spacing={2}>
                {Object.keys(permissionsByModule).map((module) => (
                  <Box key={module}>
                    <Chip label={module} size="small" color="primary" sx={{ mb: 1 }} />
                    <FormGroup>
                      {permissionsByModule[module].map((permission) => (
                        <FormControlLabel
                          key={permission.id}
                          control={
                            <Checkbox
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              size="small"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">{permission.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {permission.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
          disabled={!formData.name}
        >
          {isEdit ? 'Update Role' : 'Create Role'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

