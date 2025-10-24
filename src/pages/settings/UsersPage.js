import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Container,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  Switch,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import userService from '../../services/userService';
// sections
import UserDialog from '../../sections/@dashboard/user/UserDialog';
import ConfirmDialog from '../../components/confirm-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'user', label: 'User', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'last_login', label: 'Last Login', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function UsersPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users from API...');
      const response = await userService.getAllUsers();
      console.log('Users API Response:', response);
      if (response && response.success && response.data) {
        // Map backend fields to frontend expected fields
        const mappedUsers = response.data.map(user => ({
          ...user,
          role: user.role_name || 'No Role',
          department: user.department_name || 'No Department',
          last_login: user.last_login_at,
        }));
        console.log('Setting users:', mappedUsers);
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      enqueueSnackbar('Error loading users', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, user) => {
    setOpenPopover(event.currentTarget);
    setSelectedUser(user);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedUser(null);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await userService.toggleUserStatus(userId);
      if (response.success) {
        enqueueSnackbar('User status updated', { variant: 'success' });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleEditUser = () => {
    setEditUser(selectedUser);
    setOpenDialog(true);
    handleClosePopover();
  };

  const handleDeleteClick = () => {
    handleClosePopover();
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedUser) {
        const response = await userService.deleteUser(selectedUser.id);
        if (response.success) {
          enqueueSnackbar('User deleted successfully', { variant: 'success' });
          fetchUsers();
          setOpenConfirm(false);
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error deleting user', { variant: 'error' });
    }
  };

  const handleResetPassword = async () => {
    try {
      if (selectedUser) {
        const newPassword = prompt('Enter new password (min 6 characters):');
        if (newPassword && newPassword.length >= 6) {
          const response = await userService.resetPassword(selectedUser.id, newPassword);
          if (response.success) {
            enqueueSnackbar('Password reset successfully', { variant: 'success' });
            handleClosePopover();
          }
        } else if (newPassword) {
          enqueueSnackbar('Password must be at least 6 characters', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      enqueueSnackbar('Error resetting password', { variant: 'error' });
    }
  };

  const handleLoginAsUser = async () => {
    try {
      if (selectedUser) {
        const confirmed = window.confirm(
          `Are you sure you want to login as ${selectedUser.name}?\n\nYou will be logged out from your current session.`
        );
        
        if (confirmed) {
          const response = await userService.loginAsUser(selectedUser.id);
          if (response.success) {
            // Store the impersonation data
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('permissions', JSON.stringify(response.data.user.permissions));
            localStorage.setItem('isImpersonating', 'true');
            
            enqueueSnackbar(`Now logged in as ${selectedUser.name}`, { variant: 'info' });
            
            // Reload the page to apply new user session
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('Error logging in as user:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error logging in as user', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'error';
      case 'HR Manager':
        return 'primary';
      case 'Department Manager':
        return 'info';
      case 'Finance Manager':
        return 'warning';
      case 'Employee':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filterName.toLowerCase()) ||
    user.email.toLowerCase().includes(filterName.toLowerCase()) ||
    user.role.toLowerCase().includes(filterName.toLowerCase()) ||
    user.department.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Users Management | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Users Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Users' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setEditUser(null);
                setOpenDialog(true);
              }}
            >
              New User
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={filterName}
              onChange={handleFilterName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHeadCustom
                      headLabel={TABLE_HEAD}
                      rowCount={filteredUsers.length}
                    />

                    <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar src={row.avatar} />
                            <Box>
                              <Typography variant="subtitle2" noWrap>
                                {row.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.role}
                            color={getRoleColor(row.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.department}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Switch
                              checked={row.status === 'active'}
                              onChange={() => handleToggleStatus(row.id)}
                              size="small"
                            />
                            <Chip
                              label={row.status}
                              color={getStatusColor(row.status)}
                              size="small"
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.last_login ? new Date(row.last_login).toLocaleString() : 'Never'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  {isNotFound && (
                    <TableNoData
                      isNotFound={isNotFound}
                      message={`No results found for "${filterName}"`}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleEditUser}>
          <Iconify icon="eva:eye-fill" />
          View Profile
        </MenuItem>

        <MenuItem onClick={handleEditUser}>
          <Iconify icon="eva:edit-fill" />
          Edit User
        </MenuItem>

        <MenuItem onClick={handleEditUser}>
          <Iconify icon="eva:settings-2-fill" />
          Change Role
        </MenuItem>

        <MenuItem onClick={handleResetPassword}>
          <Iconify icon="eva:lock-fill" />
          Reset Password
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleLoginAsUser();
          }}
        >
          <Iconify icon="eva:log-in-fill" />
          Login As User
        </MenuItem>

        {selectedUser?.user_type !== 'super_admin' && selectedUser?.role !== 'Super Admin' && (
          <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteClick}>
            <Iconify icon="eva:trash-2-outline" />
            Delete User
          </MenuItem>
        )}
      </MenuPopover>

      {/* Create/Edit User Dialog */}
      <UserDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditUser(null);
        }}
        user={editUser}
        onSuccess={fetchUsers}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete User"
        content={
          <>
            Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
            This action cannot be undone.
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
