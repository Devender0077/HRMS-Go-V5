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
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import permissionService from '../../services/permissionService';
// sections
import PermissionDialog from '../../sections/@dashboard/permission/PermissionDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'permission', label: 'Permission', alignRight: false },
  { id: 'module', label: 'Module', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'roles', label: 'Assigned Roles', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function PermissionsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionModules, setPermissionModules] = useState([]);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [expandedModule, setExpandedModule] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await permissionService.getAllPermissions();
      if (response.success) {
        const permsData = response.data.map(p => ({
          ...p,
          roles: p.assigned_roles ? p.assigned_roles.split(', ') : []
        }));
        setPermissions(permsData);
        
        // Group by module
        const modules = {};
        permsData.forEach(p => {
          if (!modules[p.module]) {
            modules[p.module] = [];
          }
          modules[p.module].push(p.name);
        });
        
        const modulesArray = Object.keys(modules).map(name => ({
          name,
          permissions: modules[name],
          color: getModuleColorByName(name)
        }));
        
        setPermissionModules(modulesArray);
        if (modulesArray.length > 0) {
          setExpandedModule(modulesArray[0].name);
        }
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      enqueueSnackbar('Error loading permissions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getModuleColorByName = (module) => {
    const colors = {
      'User Management': 'primary',
      'Employee Management': 'info',
      'Attendance': 'success',
      'Leave Management': 'warning',
      'Payroll': 'error',
      'Reports': 'secondary'
    };
    return colors[module] || 'default';
  };

  const handleOpenPopover = (event, permission) => {
    setOpenPopover(event.currentTarget);
    setSelectedPermission(permission);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedPermission(null);
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

  const handleTogglePermission = async (permissionId) => {
    try {
      const response = await permissionService.togglePermissionStatus(permissionId);
      if (response.success) {
        enqueueSnackbar('Permission status updated', { variant: 'success' });
        fetchPermissions();
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
      enqueueSnackbar('Error updating permission status', { variant: 'error' });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermission(null);
  };

  const handleEditPermission = () => {
    setOpenDialog(true);
    handleClosePopover();
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
    handleClosePopover();
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedPermission) {
        const response = await permissionService.deletePermission(selectedPermission.id);
        if (response.success) {
          enqueueSnackbar('Permission deleted successfully', { variant: 'success' });
          fetchPermissions();
          setOpenConfirm(false);
          setSelectedPermission(null);
        }
      }
    } catch (error) {
      console.error('Error deleting permission:', error);
      enqueueSnackbar('Error deleting permission', { variant: 'error' });
    }
  };

  const handleDialogSuccess = () => {
    fetchPermissions();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getModuleColor = (module) => {
    const moduleColors = {
      'User Management': 'primary',
      'Employee Management': 'info',
      'Attendance': 'success',
      'Leave Management': 'warning',
      'Payroll': 'error',
      'Reports': 'secondary'
    };
    return moduleColors[module] || 'default';
  };

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(filterName.toLowerCase()) ||
    permission.module.toLowerCase().includes(filterName.toLowerCase()) ||
    permission.description.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredPermissions.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Permissions Management | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Permissions Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Permissions' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenDialog}
            >
              New Permission
            </Button>
          }
        />

        <Stack spacing={3}>
          {/* Module-based Permission View */}
          {loading ? (
            <Card>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
              </Box>
            </Card>
          ) : (
            <Card>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Permissions by Module
                </Typography>
                {permissionModules.map((module) => (
                <Accordion
                  key={module.name}
                  expanded={expandedModule === module.name}
                  onChange={() => setExpandedModule(expandedModule === module.name ? '' : module.name)}
                >
                  <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Chip
                        label={module.name}
                        color={module.color}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {module.permissions.length} permissions
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {module.permissions.map((permission) => (
                        <FormControlLabel
                          key={permission}
                          control={<Checkbox defaultChecked />}
                          label={permission.replace('_', ' ').toUpperCase()}
                        />
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                ))}
              </Box>
            </Card>
          )}

          {/* Detailed Permission Table */}
          <Card>
            <Stack spacing={2} sx={{ p: 3 }}>
              <TextField
                fullWidth
                placeholder="Search permissions..."
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

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD}
                    rowCount={filteredPermissions.length}
                  />

                  <TableBody>
                    {filteredPermissions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <TableRow hover key={row.id}>
                          <TableCell>
                            <Typography variant="subtitle2" noWrap>
                              {row.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.module}
                              color={getModuleColor(row.module)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {row.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {row.roles.map((role) => (
                                <Chip
                                  key={role}
                                  label={role}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Checkbox
                              checked={row.status === 'active'}
                              onChange={() => handleTogglePermission(row.id)}
                              size="small"
                            />
                            <Chip
                              label={row.status}
                              color={getStatusColor(row.status)}
                              size="small"
                            />
                          </Stack>
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
              count={filteredPermissions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            console.log('View permission:', selectedPermission);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem onClick={handleEditPermission}>
          <Iconify icon="eva:edit-fill" />
          Edit Permission
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Assign roles:', selectedPermission);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:people-fill" />
          Assign Roles
        </MenuItem>

        <MenuItem 
          sx={{ color: 'error.main' }}
          onClick={handleDeleteClick}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <PermissionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleDialogSuccess}
        permission={selectedPermission}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete Permission"
        content={
          <>
            Are you sure you want to delete permission <strong>{selectedPermission?.name}</strong>?
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
