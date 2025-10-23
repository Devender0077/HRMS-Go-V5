import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import Iconify from '../../../components/iconify';
// services
import roleService from '../../../services/roleService';

// ----------------------------------------------------------------------

RoleViewDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  roleId: PropTypes.number,
};

export default function RoleViewDialog({ open, onClose, roleId }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && roleId) {
      console.log('Dialog opened with roleId:', roleId);
      setRole(null); // Reset first
      fetchRoleDetails();
    } else {
      console.log('Dialog state - open:', open, 'roleId:', roleId);
      if (!open) {
        setRole(null); // Reset when closing
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, roleId]);

  const fetchRoleDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching role details for ID:', roleId);
      const response = await roleService.getRoleById(roleId);
      console.log('Role details response:', response);
      if (response && response.success && response.data) {
        console.log('Setting role data:', response.data);
        setRole(response.data);
      } else {
        console.warn('No valid response:', response);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Role Details</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : role ? (
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Role Name
              </Typography>
              <Typography variant="h6">{role.name}</Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2">{role.description || 'No description'}</Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={role.status}
                color={role.status === 'active' ? 'success' : 'default'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Statistics
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Chip
                  icon={<Iconify icon="eva:people-fill" />}
                  label={`${role.users_count || 0} Users`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<Iconify icon="eva:lock-fill" />}
                  label={`${role.permissions_count || 0} Permissions`}
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            {role.permissions && role.permissions.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Assigned Permissions ({role.permissions.length})
                  </Typography>
                  <List dense>
                    {role.permissions.map((permission) => (
                      <ListItem key={permission.id}>
                        <ListItemText
                          primary={permission.name}
                          secondary={permission.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}

            <Divider />

            <Box>
              <Typography variant="overline" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {new Date(role.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography>No data available</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

