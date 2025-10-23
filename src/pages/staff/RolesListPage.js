import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Role Name', alignRight: false },
  { id: 'slug', label: 'Slug', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'is_system', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Full system access with all permissions',
    is_system: true,
    status: 'active',
  },
  {
    id: 2,
    name: 'Administrator',
    slug: 'administrator',
    description: 'Admin access with most permissions',
    is_system: true,
    status: 'active',
  },
  {
    id: 3,
    name: 'HR Manager',
    slug: 'hr-manager',
    description: 'Manage HR operations and employee records',
    is_system: true,
    status: 'active',
  },
  {
    id: 4,
    name: 'HR Executive',
    slug: 'hr-executive',
    description: 'Execute HR tasks and processes',
    is_system: true,
    status: 'active',
  },
  {
    id: 5,
    name: 'Manager',
    slug: 'manager',
    description: 'Manage team members and operations',
    is_system: true,
    status: 'active',
  },
  {
    id: 6,
    name: 'Team Lead',
    slug: 'team-lead',
    description: 'Lead a team and assign tasks',
    is_system: false,
    status: 'active',
  },
  {
    id: 7,
    name: 'Employee',
    slug: 'employee',
    description: 'Standard employee access',
    is_system: true,
    status: 'active',
  },
  {
    id: 8,
    name: 'Accountant',
    slug: 'accountant',
    description: 'Manage payroll and financial operations',
    is_system: false,
    status: 'active',
  },
  {
    id: 9,
    name: 'Recruiter',
    slug: 'recruiter',
    description: 'Manage recruitment and hiring',
    is_system: false,
    status: 'active',
  },
];

// ----------------------------------------------------------------------

export default function RolesListPage() {
  const { themeStretch } = useSettingsContext();

  const [roles, setRoles] = useState(MOCK_ROLES);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(filterName.toLowerCase()) ||
    role.slug.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredRoles.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Roles | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Roles & Permissions"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: 'Roles' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.staff.roles.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
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

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredRoles.length}
                />

                <TableBody>
                  {filteredRoles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                            {row.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {row.is_system ? (
                            <Chip label="System" color="default" size="small" />
                          ) : (
                            <Chip label="Custom" color="primary" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
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
        </Card>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            console.log('View role:', selectedRole);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Edit permissions:', selectedRole);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:lock-fill" />
          Permissions
        </MenuItem>

        {selectedRole && !selectedRole.is_system && (
          <>
            <MenuItem
              onClick={() => {
                console.log('Edit role:', selectedRole);
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>

            <MenuItem
              sx={{ color: 'error.main' }}
              onClick={() => {
                console.log('Delete role:', selectedRole);
                handleClosePopover();
              }}
            >
              <Iconify icon="eva:trash-2-outline" />
              Delete
            </MenuItem>
          </>
        )}
      </MenuPopover>
    </>
  );
}

