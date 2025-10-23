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
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'type', label: 'Contract Type', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'duration', label: 'Duration', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_CONTRACTS = [
  { id: 1, employee: 'John Doe', type: 'Permanent', startDate: '2023-01-15', endDate: '-', duration: 'Indefinite', status: 'active' },
  { id: 2, employee: 'Jane Smith', type: 'Contract', startDate: '2024-06-01', endDate: '2025-05-31', duration: '12 months', status: 'active' },
  { id: 3, employee: 'Bob Johnson', type: 'Contract', startDate: '2024-01-01', endDate: '2024-12-31', duration: '12 months', status: 'expiring_soon' },
  { id: 4, employee: 'Alice Williams', type: 'Internship', startDate: '2024-09-01', endDate: '2024-11-30', duration: '3 months', status: 'expired' },
];

// ----------------------------------------------------------------------

export default function ContractsListPage() {
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
  const [tableData] = useState(MOCK_CONTRACTS);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring_soon': return 'warning';
      case 'expired': return 'error';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Contracts: List | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Contracts"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Contracts' },
            { name: 'List' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Contract
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
                        <TableCell>
                          <Typography variant="subtitle2">{row.employee}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.type} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{row.startDate}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            color={row.status === 'expiring_soon' ? 'warning.main' : 'text.primary'}
                          >
                            {row.endDate}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{row.duration}</TableCell>
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
                            <Iconify icon="eva:download-fill" />
                          </IconButton>
                          {row.status === 'expiring_soon' && (
                            <IconButton size="small" color="warning">
                              <Iconify icon="eva:refresh-fill" />
                            </IconButton>
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

