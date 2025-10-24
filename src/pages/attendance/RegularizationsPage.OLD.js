import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'reason', label: 'Reason', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'requested_at', label: 'Requested At', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_REGULARIZATIONS = [
  {
    id: 1,
    employee: {
      name: 'John Doe',
      avatar: '/assets/images/avatars/avatar_1.jpg',
      employee_id: 'EMP001',
    },
    date: '2024-01-15',
    reason: 'Medical emergency - had to visit doctor',
    status: 'pending',
    requested_at: '2024-01-15 09:30 AM',
    approved_by: null,
    approved_at: null,
  },
  {
    id: 2,
    employee: {
      name: 'Jane Smith',
      avatar: '/assets/images/avatars/avatar_2.jpg',
      employee_id: 'EMP002',
    },
    date: '2024-01-14',
    reason: 'Traffic jam - stuck in traffic for 2 hours',
    status: 'approved',
    requested_at: '2024-01-14 10:15 AM',
    approved_by: 'HR Manager',
    approved_at: '2024-01-14 02:30 PM',
  },
  {
    id: 3,
    employee: {
      name: 'Mike Johnson',
      avatar: '/assets/images/avatars/avatar_3.jpg',
      employee_id: 'EMP003',
    },
    date: '2024-01-13',
    reason: 'Family emergency - had to attend to sick child',
    status: 'rejected',
    requested_at: '2024-01-13 08:45 AM',
    approved_by: 'HR Manager',
    approved_at: '2024-01-13 11:20 AM',
  },
];

// ----------------------------------------------------------------------

export default function RegularizationsPage() {
  const { themeStretch } = useSettingsContext();

  const [regularizations, setRegularizations] = useState(MOCK_REGULARIZATIONS);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedRegularization, setSelectedRegularization] = useState(null);

  const handleOpenPopover = (event, regularization) => {
    setOpenPopover(event.currentTarget);
    setSelectedRegularization(regularization);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedRegularization(null);
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
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleApprove = (id) => {
    setRegularizations(prev => 
      prev.map(reg => 
        reg.id === id 
          ? { ...reg, status: 'approved', approved_by: 'Current User', approved_at: new Date().toLocaleString() }
          : reg
      )
    );
    handleClosePopover();
  };

  const handleReject = (id) => {
    setRegularizations(prev => 
      prev.map(reg => 
        reg.id === id 
          ? { ...reg, status: 'rejected', approved_by: 'Current User', approved_at: new Date().toLocaleString() }
          : reg
      )
    );
    handleClosePopover();
  };

  const filteredRegularizations = regularizations.filter((regularization) =>
    regularization.employee.name.toLowerCase().includes(filterName.toLowerCase()) ||
    regularization.reason.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredRegularizations.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Attendance Regularizations | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Attendance Regularizations"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Attendance', href: PATH_DASHBOARD.attendance.root },
            { name: 'Regularizations' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Request
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search regularizations..."
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
                  rowCount={filteredRegularizations.length}
                />

                <TableBody>
                  {filteredRegularizations
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar src={row.employee.avatar} />
                            <Box>
                              <Typography variant="subtitle2" noWrap>
                                {row.employee.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employee.employee_id}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(row.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {row.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.requested_at}
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
            count={filteredRegularizations.length}
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
            console.log('View regularization:', selectedRegularization);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        {selectedRegularization?.status === 'pending' && (
          <>
            <MenuItem
              onClick={() => handleApprove(selectedRegularization.id)}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="eva:checkmark-circle-2-fill" />
              Approve
            </MenuItem>

            <MenuItem
              onClick={() => handleReject(selectedRegularization.id)}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="eva:close-circle-fill" />
              Reject
            </MenuItem>
          </>
        )}

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}