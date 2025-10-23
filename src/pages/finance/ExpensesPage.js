import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';

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
  const [tableData] = useState(MOCK_EXPENSES);

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
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.employee}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="error.main">
                            ${row.amount.toFixed(2)}
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
                          <IconButton size="small">
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                          {row.status === 'pending' && (
                            <>
                              <IconButton size="small" color="success">
                                <Iconify icon="eva:checkmark-circle-fill" />
                              </IconButton>
                              <IconButton size="small" color="error">
                                <Iconify icon="eva:close-circle-fill" />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  {tableData.length === 0 && <TableNoData isNotFound={true} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={tableData.length}
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

