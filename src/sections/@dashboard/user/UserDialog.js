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
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// services
import userService from '../../../services/userService';
import departmentService from '../../../services/departmentService';
import roleService from '../../../services/roleService';

// ----------------------------------------------------------------------

UserDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default function UserDialog({ open, onClose, user, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '',
    role_id: '',
    user_type: 'employee',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (open) {
      fetchDepartments();
      fetchRoles();
      
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          password: '',
          phone: user.phone || '',
          department_id: user.department_id || '',
          role_id: user.role_id || '',
          user_type: user.role || user.user_type || 'employee',
          status: user.status || 'active',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          department_id: '',
          role_id: '',
          user_type: 'employee',
          status: 'active',
        });
      }
    }
  }, [open, user]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleService.getAllRoles();
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (!formData.name || !formData.email) {
        enqueueSnackbar('Name and email are required', { variant: 'error' });
        return;
      }

      if (!isEdit && !formData.password) {
        enqueueSnackbar('Password is required for new user', { variant: 'error' });
        return;
      }

      const data = { ...formData };
      // Don't send empty password on edit
      if (isEdit && !data.password) {
        delete data.password;
      }

      let response;
      if (isEdit) {
        response = await userService.updateUser(user.id, data);
      } else {
        response = await userService.createUser(data);
      }

      if (response.success) {
        enqueueSnackbar(isEdit ? 'User updated successfully' : 'User created successfully', {
          variant: 'success',
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error saving user', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label={isEdit ? 'New Password (leave empty to keep current)' : 'Password'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
            helperText={isEdit ? 'Leave empty to keep current password' : 'Minimum 6 characters'}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Department"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Role"
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="User Type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
          >
            <MenuItem value="super_admin">Super Admin</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
            <MenuItem value="hr_manager">HR Manager</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </TextField>

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
          disabled={!formData.name || !formData.email}
        >
          {isEdit ? 'Update User' : 'Create User'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

