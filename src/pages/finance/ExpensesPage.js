import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';
// services
import expenseService from '../../services/api/expenseService';
// utils
import { fDate } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_EXPENSES = [
  { id: 1, date: '2024-12-15', employee: 'John Doe', category: 'Travel', description: 'Client meeting in NYC', amount: 450.00, status: 'pending' },
  { id: 2, date: '2024-12-14', employee: 'Jane Smith', category: 'Office Supplies', description: 'Printer ink and paper', amount: 120.50, status: 'approved' },
  { id: 3, date: '2024-12-13', employee: 'Bob Johnson', category: 'Meals', description: 'Team lunch', amount: 85.00, status: 'approved' },
  { id: 4, date: '2024-12-12', employee: 'Alice Williams', category: 'Travel', description: 'Conference attendance', amount: 1200.00, status: 'rejected' },
];

// ----------------------------------------------------------------------

export default function ExpensesPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success && response.data) {
        setTableData(response.data.expenses || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      enqueueSnackbar('Error loading expenses', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    if (!window.confirm('Approve this expense claim?')) return;
    
    try {
      const response = await expenseService.approve(expenseId);
      if (response.success) {
        enqueueSnackbar('Expense approved successfully', { variant: 'success' });
        fetchExpenses();
      } else {
        enqueueSnackbar(response.message || 'Failed to approve', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error approving expense', { variant: 'error' });
    }
  };

  const handleReject = async (expenseId) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;
    
    try {
      const response = await expenseService.reject(expenseId, reason);
      if (response.success) {
        enqueueSnackbar('Expense rejected', { variant: 'success' });
        fetchExpenses();
      } else {
        enqueueSnackbar(response.message || 'Failed to reject', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error rejecting expense', { variant: 'error' });
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    
    try {
      const response = await expenseService.delete(expenseId);
      if (response.success) {
        enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
        fetchExpenses();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting expense', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'paid': return 'info';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Finance: Expenses | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Expense Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Finance' },
            { name: 'Expenses' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Expense
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {tableData.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{fDate(row.expenseDate || row.date)}</TableCell>
                          <TableCell>
                            <Stack>
                              <Typography variant="subtitle2">{row.employeeName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employeeCode}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip label={row.category} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {row.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              ₹{row.amount?.toFixed(2) || '0.00'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.status}
                              size="small"
                              color={getStatusColor(row.status)}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              {row.status === 'pending' && (
                                <>
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleApprove(row.id)}
                                  >
                                    <Iconify icon="eva:checkmark-circle-fill" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleReject(row.id)}
                                  >
                                    <Iconify icon="eva:close-circle-fill" />
                                  </IconButton>
                                </>
                              )}
                              <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                                <Iconify icon="eva:trash-2-outline" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {tableData.length === 0 && <TableNoData isNotFound={true} />}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

