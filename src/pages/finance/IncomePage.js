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
  const [tableData] = useState(MOCK_INCOME);

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
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.source}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="success.main">
                            ${row.amount.toLocaleString()}
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
                          <IconButton size="small">
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
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

