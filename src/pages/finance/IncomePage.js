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
import incomeService from '../../services/api/incomeService';
// utils
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'source', label: 'Source', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_INCOME = [
  { id: 1, date: '2024-12-15', source: 'Client Payment', category: 'Service Income', description: 'Project completion payment', amount: 15000.00, status: 'received' },
  { id: 2, date: '2024-12-10', source: 'Subscription', category: 'Recurring Income', description: 'Monthly subscription', amount: 2500.00, status: 'received' },
  { id: 3, date: '2024-12-08', source: 'Consulting', category: 'Service Income', description: 'Consulting services', amount: 5000.00, status: 'pending' },
];

// ----------------------------------------------------------------------

export default function IncomePage() {
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
    fetchIncome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const response = await incomeService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success && response.data) {
        setTableData(response.data.income || []);
        setTotalCount(response.data.totalCount || 0);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching income:', error);
      enqueueSnackbar('Error loading income', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (incomeId) => {
    if (!window.confirm('Delete this income record?')) return;
    
    try {
      const response = await incomeService.delete(incomeId);
      if (response.success) {
        enqueueSnackbar('Income record deleted successfully', { variant: 'success' });
        fetchIncome();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting income record', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Finance: Income | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Income Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Finance' },
            { name: 'Income' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Income
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
                          <TableCell>{fDate(row.incomeDate)}</TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">{row.source}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={row.category} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{row.description}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" color="success.main">
                              ₹{row.amount?.toLocaleString() || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.status || 'received'}
                              size="small"
                              color={getStatusColor(row.status || 'received')}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => enqueueSnackbar('View coming soon', { variant: 'info' })}>
                              <Iconify icon="eva:eye-fill" />
                            </IconButton>
                            <IconButton size="small" onClick={() => enqueueSnackbar('Edit coming soon', { variant: 'info' })}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton>
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

