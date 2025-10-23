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
import ConfirmDialog from '../../components/confirm-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import roleService from '../../services/roleService';
// sections
import RoleDialog from '../../sections/@dashboard/role/RoleDialog';
import RoleViewDialog from '../../sections/@dashboard/role/RoleViewDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Role Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'users', label: 'Users', alignRight: false },
  { id: 'permissions', label: 'Permissions', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'created', label: 'Created', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function RolesPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editRole, setEditRole] = useState(null);

  // Fetch roles from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      console.log('Fetching roles from API...');
      const response = await roleService.getAllRoles();
      console.log('Roles API Response:', response);
      if (response && response.success && response.data) {
        console.log('Setting roles:', response.data);
        setRoles(response.data);
        enqueueSnackbar(`Loaded ${response.data.length} roles from database`, { variant: 'success' });
      } else {
        console.warn('No data in response:', response);
        enqueueSnackbar('No roles found', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      enqueueSnackbar(`Error loading roles: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, role) => {
    setOpenPopover(event.currentTarget);
    setSelectedRole(role);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedRole(null);
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

  const handleToggleStatus = async (roleId) => {
    try {
      const response = await roleService.toggleRoleStatus(roleId);
      if (response.success) {
        enqueueSnackbar('Role status updated successfully', { variant: 'success' });
        fetchRoles(); // Refresh data
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      enqueueSnackbar('Error updating role status', { variant: 'error' });
    }
  };

  const handleDeleteClick = () => {
    handleClosePopover();
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedRole) {
        console.log('Deleting role:', selectedRole.id);
        const response = await roleService.deleteRole(selectedRole.id);
        console.log('Delete response:', response);
        
        if (response.success) {
          enqueueSnackbar('Role deleted successfully', { variant: 'success' });
          fetchRoles();
          setOpenConfirm(false);
          setSelectedRole(null);
        } else {
          enqueueSnackbar(response.message || 'Failed to delete role', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting role';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setOpenConfirm(false);
    }
  };

  const handleViewRole = () => {
    setOpenViewDialog(true);
    handleClosePopover();
  };

  const handleEditRole = () => {
    setEditRole(selectedRole);
    setOpenDialog(true);
    handleClosePopover();
  };

  const handleDuplicateRole = async () => {
    try {
      if (selectedRole) {
        const newRole = {
          name: `${selectedRole.name} (Copy)`,
          description: selectedRole.description,
          status: 'active',
        };
        const response = await roleService.createRole(newRole);
        if (response.success) {
          enqueueSnackbar('Role duplicated successfully', { variant: 'success' });
          fetchRoles();
          handleClosePopover();
        }
      }
    } catch (error) {
      console.error('Error duplicating role:', error);
      enqueueSnackbar('Error duplicating role', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getRoleColor = (color) => {
    return color;
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(filterName.toLowerCase()) ||
    role.description.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredRoles.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Roles & Permissions | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Roles & Permissions"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Roles' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setEditRole(null);
                setOpenDialog(true);
              }}
            >
              New Role
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search roles..."
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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>Loading roles from database...</Typography>
            </Box>
          ) : roles.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <Typography variant="h6" color="text.secondary">No roles found in database</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "New Role" to create your first role
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ px: 3, py: 2, bgcolor: 'background.neutral' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredRoles.length} of {roles.length} roles from database
                </Typography>
              </Box>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHeadCustom
                      headLabel={TABLE_HEAD}
                      rowCount={filteredRoles.length}
                    />

                    <TableBody>
                  {filteredRoles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {row.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.users_count} users
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.permissions_count} permissions
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
                count={filteredRoles.length}
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
        <MenuItem onClick={handleViewRole}>
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem onClick={handleEditRole}>
          <Iconify icon="eva:edit-fill" />
          Edit Role
        </MenuItem>

        <MenuItem onClick={handleEditRole}>
          <Iconify icon="eva:settings-2-fill" />
          Manage Permissions
        </MenuItem>

        <MenuItem onClick={handleViewRole}>
          <Iconify icon="eva:people-fill" />
          View Users
        </MenuItem>

        <MenuItem onClick={handleDuplicateRole}>
          <Iconify icon="eva:copy-fill" />
          Duplicate
        </MenuItem>

        {selectedRole?.name !== 'Super Admin' && (
          <MenuItem 
            sx={{ color: 'error.main' }}
            onClick={handleDeleteClick}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        )}
      </MenuPopover>

      {/* Create/Edit Role Dialog */}
      <RoleDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditRole(null);
        }}
        role={editRole}
        onSuccess={fetchRoles}
      />

      {/* View Role Dialog */}
      <RoleViewDialog
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
        }}
        roleId={selectedRole?.id}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete Role"
        content={
          <>
            Are you sure you want to delete role <strong>{selectedRole?.name}</strong>?
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
