import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
// services
import payrollService from '../../services/payrollService';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'period', label: 'Pay Period', alignRight: false },
  { id: 'basic_salary', label: 'Basic Salary', alignRight: false },
  { id: 'gross_salary', label: 'Gross Salary', alignRight: false },
  { id: 'deductions', label: 'Deductions', alignRight: false },
  { id: 'net_salary', label: 'Net Salary', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_PAYSLIPS = [
  {
    id: 1,
    employee: {
      name: 'John Doe',
      avatar: '/assets/images/avatars/avatar_1.jpg',
      employee_id: 'EMP001',
    },
    period: 'January 2024',
    basic_salary: 50000,
    gross_salary: 65000,
    deductions: 8000,
    net_salary: 57000,
    status: 'paid',
    paid_date: '2024-02-01',
    created_at: '2024-01-31',
  },
  {
    id: 2,
    employee: {
      name: 'Jane Smith',
      avatar: '/assets/images/avatars/avatar_2.jpg',
      employee_id: 'EMP002',
    },
    period: 'January 2024',
    basic_salary: 45000,
    gross_salary: 58000,
    deductions: 7200,
    net_salary: 50800,
    status: 'paid',
    paid_date: '2024-02-01',
    created_at: '2024-01-31',
  },
  {
    id: 3,
    employee: {
      name: 'Mike Johnson',
      avatar: '/assets/images/avatars/avatar_3.jpg',
      employee_id: 'EMP003',
    },
    period: 'January 2024',
    basic_salary: 40000,
    gross_salary: 52000,
    deductions: 6400,
    net_salary: 45600,
    status: 'pending',
    paid_date: null,
    created_at: '2024-01-31',
  },
];

// ----------------------------------------------------------------------

export default function PayslipsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch payslips from backend
  useEffect(() => {
    fetchPayslips();
  }, [page, rowsPerPage]);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      const response = await payrollService.getPayslips({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success) {
        setPayslips(response.payslips || response.data?.payrolls || []);
      } else {
        setPayslips([]);
      }
    } catch (error) {
      console.error('Error fetching payslips:', error);
      enqueueSnackbar('Error loading payslips', { variant: 'error' });
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, payslip) => {
    setOpenPopover(event.currentTarget);
    setSelectedPayslip(payslip);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedPayslip(null);
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
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Safety check
  const safePayslips = payslips || [];
  
  const filteredPayslips = safePayslips.filter((payslip) => {
    if (!payslip || !payslip.employee) return false;
    const name = payslip.employee.name || '';
    const empId = payslip.employee.employee_id || payslip.employee.employeeId || '';
    return name.toLowerCase().includes(filterName.toLowerCase()) ||
           empId.toLowerCase().includes(filterName.toLowerCase());
  });

  const isNotFound = !filteredPayslips.length && !!filterName;

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await payrollService.deletePayroll(deleteId);
      if (response.success) {
        enqueueSnackbar('Payslip deleted successfully');
        fetchPayslips();
        handleCloseConfirm();
        handleClosePopover();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Payslips | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Payslips"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Payroll', href: PATH_DASHBOARD.payroll.root },
            { name: 'Payslips' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:download-outline" />}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Generate Payslips
              </Button>
            </Stack>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search payslips..."
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
                  rowCount={filteredPayslips.length}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} sx={{ textAlign: 'center', py: 5 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {filteredPayslips
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
                            {row.period}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(row.basic_salary)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(row.gross_salary)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main">
                            -{formatCurrency(row.deductions)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {formatCurrency(row.net_salary)}
                          </Typography>
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
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayslips.length}
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
            console.log('View payslip:', selectedPayslip);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Payslip
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Download payslip:', selectedPayslip);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:download-fill" />
          Download PDF
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Email payslip:', selectedPayslip);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:email-fill" />
          Email to Employee
        </MenuItem>

        <MenuItem 
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDeleteClick(selectedPayslip?.id);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete Payslip"
        content="Are you sure you want to delete this payslip?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}