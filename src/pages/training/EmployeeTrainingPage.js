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
  LinearProgress,
  Box,
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
  { id: 'program', label: 'Program', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'progress', label: 'Progress', align: 'center' },
  { id: 'score', label: 'Score', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_EMPLOYEE_TRAINING = [
  { id: 1, employee: 'John Doe', program: 'React Advanced Training', startDate: '2024-12-01', endDate: '2024-12-28', progress: 75, score: null, status: 'in_progress' },
  { id: 2, employee: 'Jane Smith', program: 'Leadership Development', startDate: '2024-11-15', endDate: '2024-12-27', progress: 90, score: null, status: 'in_progress' },
  { id: 3, employee: 'Bob Johnson', program: 'Sales Techniques', startDate: '2024-12-01', endDate: '2024-12-15', progress: 100, score: 95, status: 'completed' },
  { id: 4, employee: 'Alice Williams', program: 'Communication Skills', startDate: '2025-01-05', endDate: '2025-01-26', progress: 0, score: null, status: 'enrolled' },
];

// ----------------------------------------------------------------------

export default function EmployeeTrainingPage() {
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
  const [tableData] = useState(MOCK_EMPLOYEE_TRAINING);

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'dropped': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Training: Employee Training | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Training"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Training' },
            { name: 'Employee Training' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Enroll Employee
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
                        <TableCell>{row.program}</TableCell>
                        <TableCell>{row.startDate}</TableCell>
                        <TableCell>{row.endDate}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ minWidth: 120 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ width: '100%' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={row.progress}
                                  color={
                                    row.progress >= 75 ? 'success' :
                                    row.progress >= 50 ? 'info' :
                                    row.progress >= 25 ? 'warning' : 'error'
                                  }
                                  sx={{ height: 8, borderRadius: 1 }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {row.progress}%
                              </Typography>
                            </Stack>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {row.score ? (
                            <Chip 
                              label={`${row.score}%`} 
                              size="small" 
                              color={row.score >= 80 ? 'success' : row.score >= 60 ? 'info' : 'warning'}
                            />
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              -
                            </Typography>
                          )}
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
                          {row.status === 'completed' && (
                            <IconButton size="small" color="success">
                              <Iconify icon="eva:award-fill" />
                            </IconButton>
                          )}
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:close-circle-fill" />
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

