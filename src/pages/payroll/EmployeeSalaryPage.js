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
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Box,
  Autocomplete,
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
  { id: 'designation', label: 'Designation', align: 'left' },
  { id: 'basic', label: 'Basic Salary', align: 'right' },
  { id: 'gross', label: 'Gross Salary', align: 'right' },
  { id: 'deductions', label: 'Deductions', align: 'right' },
  { id: 'net', label: 'Net Salary', align: 'right' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_EMPLOYEES = [
  { id: 1, name: 'John Doe', empId: 'EMP001', designation: 'Software Engineer', basic: 50000, gross: 75000, deductions: 8500, net: 66500 },
  { id: 2, name: 'Jane Smith', empId: 'EMP002', designation: 'HR Manager', basic: 60000, gross: 90000, deductions: 10200, net: 79800 },
  { id: 3, name: 'Bob Johnson', empId: 'EMP003', designation: 'Marketing Lead', basic: 55000, gross: 82500, deductions: 9350, net: 73150 },
];

const SALARY_COMPONENTS = [
  { id: 1, name: 'Basic Salary', code: 'BASIC', type: 'earning', calculation: 'fixed', amount: 0 },
  { id: 2, name: 'HRA', code: 'HRA', type: 'earning', calculation: 'percentage', amount: 40 },
  { id: 3, name: 'DA', code: 'DA', type: 'earning', calculation: 'percentage', amount: 20 },
  { id: 4, name: 'TA', code: 'TA', type: 'earning', calculation: 'fixed', amount: 1600 },
  { id: 5, name: 'PF', code: 'PF', type: 'deduction', calculation: 'percentage', amount: 12 },
  { id: 6, name: 'Professional Tax', code: 'PTAX', type: 'deduction', calculation: 'fixed', amount: 200 },
];

// ----------------------------------------------------------------------

export default function EmployeeSalaryPage() {
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
  const [tableData] = useState(MOCK_EMPLOYEES);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryStructure, setSalaryStructure] = useState([]);

  const handleOpenDialog = (employee) => {
    setSelectedEmployee(employee);
    // Mock salary structure
    setSalaryStructure([
      { componentId: 1, name: 'Basic Salary', value: employee.basic },
      { componentId: 2, name: 'HRA (40%)', value: employee.basic * 0.4 },
      { componentId: 3, name: 'DA (20%)', value: employee.basic * 0.2 },
      { componentId: 4, name: 'TA', value: 1600 },
      { componentId: 5, name: 'PF (12%)', value: employee.basic * 0.12, isDeduction: true },
      { componentId: 6, name: 'Professional Tax', value: 200, isDeduction: true },
    ]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const calculateTotals = () => {
    const earnings = salaryStructure.filter(s => !s.isDeduction).reduce((sum, s) => sum + s.value, 0);
    const deductions = salaryStructure.filter(s => s.isDeduction).reduce((sum, s) => sum + s.value, 0);
    return { earnings, deductions, net: earnings - deductions };
  };

  const totals = selectedEmployee ? calculateTotals() : { earnings: 0, deductions: 0, net: 0 };

  return (
    <>
      <Helmet>
        <title> Payroll: Employee Salary | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Salary"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Payroll', href: PATH_DASHBOARD.payroll.root },
            { name: 'Employee Salary' },
          ]}
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
                          <Stack>
                            <Typography variant="subtitle2">{row.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.empId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.designation}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2">${row.basic.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="success.main">
                            ${row.gross.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="error.main">
                            ${row.deductions.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary.main">
                            ${row.net.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleOpenDialog(row)} size="small">
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:edit-fill" />
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

      {/* Salary Structure Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Salary Structure - {selectedEmployee?.name}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({selectedEmployee?.empId})
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Earnings */}
            <Box>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Earnings
              </Typography>
              {salaryStructure.filter(s => !s.isDeduction).map((component, index) => (
                <Stack key={index} direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2">{component.name}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${component.value.toLocaleString()}
                  </Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1.5, bgcolor: 'success.lighter' }}>
                <Typography variant="subtitle2">Total Earnings</Typography>
                <Typography variant="subtitle2" color="success.main">
                  ${totals.earnings.toLocaleString()}
                </Typography>
              </Stack>
            </Box>

            {/* Deductions */}
            <Box>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Deductions
              </Typography>
              {salaryStructure.filter(s => s.isDeduction).map((component, index) => (
                <Stack key={index} direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2">{component.name}</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ${component.value.toLocaleString()}
                  </Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between" sx={{ py: 1.5, bgcolor: 'error.lighter' }}>
                <Typography variant="subtitle2">Total Deductions</Typography>
                <Typography variant="subtitle2" color="error.main">
                  ${totals.deductions.toLocaleString()}
                </Typography>
              </Stack>
            </Box>

            {/* Net Salary */}
            <Stack direction="row" justifyContent="space-between" sx={{ py: 2, bgcolor: 'primary.lighter', px: 2, borderRadius: 1 }}>
              <Typography variant="h6">Net Salary</Typography>
              <Typography variant="h5" color="primary.main">
                ${totals.net.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="contained" startIcon={<Iconify icon="eva:edit-fill" />}>
            Edit Salary
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

