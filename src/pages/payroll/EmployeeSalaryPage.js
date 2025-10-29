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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  
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
import employeeService from '../../services/api/employeeService';

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

// We'll load employees from the API instead of using mock data

// salary components (not used currently)

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
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryStructure, setSalaryStructure] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenDialog = (employee, edit = false) => {
    setSelectedEmployee(employee);
    setIsEditing(Boolean(edit));
    // Mock salary structure
    setSalaryStructure([
      { componentId: 1, name: 'Basic Salary', value: (employee.basic ?? employee.basicSalary ?? employee.salary?.basic ?? 0) },
      { componentId: 2, name: 'HRA (40%)', value: (employee.basic ?? employee.basicSalary ?? employee.salary?.basic ?? 0) * 0.4 },
      { componentId: 3, name: 'DA (20%)', value: (employee.basic ?? employee.basicSalary ?? employee.salary?.basic ?? 0) * 0.2 },
      { componentId: 4, name: 'TA', value: 1600 },
      { componentId: 5, name: 'PF (12%)', value: (employee.basic ?? employee.basicSalary ?? employee.salary?.basic ?? 0) * 0.12, isDeduction: true },
      { componentId: 6, name: 'Professional Tax', value: 200, isDeduction: true },
    ]);
    setOpenDialog(true);
  };

  // (kept for backward compatibility; prefer updateComponentValueById)

  const updateComponentValueById = (componentId, newValue) => {
    setSalaryStructure((prev) => prev.map((s) => (s.componentId === componentId ? { ...s, value: Number(newValue) } : s)));
  };

  // Fetch employees from API on mount
  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await employeeService.getAll();
        if (!alive) return;
        if (res.success) {
          const mapped = (res.data || []).map((emp) => {
            const basic = emp.basic ?? emp.basicSalary ?? emp.salary?.basic ?? 0;
            const gross = emp.gross ?? emp.salary?.gross ?? basic;
            const deductions = emp.deductions ?? emp.salary?.deductions ?? 0;
            const net = emp.net ?? (gross - deductions);
            return {
              id: emp.id ?? emp._id ?? emp.employeeId,
              name: emp.name ?? emp.fullName ?? '',
              empId: emp.empId ?? emp.employeeId ?? `EMP${emp.id ?? ''}`,
              designation: emp.designation ?? emp.jobTitle ?? '',
              basic,
              gross,
              deductions,
              net,
              raw: emp,
            };
          });
          setTableData(mapped);
        } else {
          setFetchError(res.message || 'Failed to load employees');
        }
      } catch (err) {
        if (!alive) return;
        setFetchError(err.message || 'Failed to load employees');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  const handleSaveSalary = () => {
    // Save salary to backend (attempt)
    (async () => {
      if (!selectedEmployee) return;
      setSaving(true);
      try {
        // Build payload: backend expects basicSalary as top-level field (see backend controller)
        const basicValue = salaryStructure.find(c => c.componentId === 1)?.value ?? 0;
        const payload = {
          basicSalary: Number(basicValue),
          // Optionally include paymentMethod if available: paymentMethod: selectedEmployee.raw?.paymentMethod || selectedEmployee.raw?.payment_method
        };

        const res = await employeeService.update(selectedEmployee.id, payload);
        if (res && res.success) {
          // update table row locally
          setTableData((prev) => prev.map((r) => {
            if (String(r.id) === String(selectedEmployee.id)) {
              return {
                ...r,
                basic: salaryStructure.find(c => c.componentId === 1)?.value ?? r.basic,
                gross: totals.earnings,
                deductions: totals.deductions,
                net: totals.net,
              };
            }
            return r;
          }));

          setOpenDialog(false);
          setIsEditing(false);
          enqueueSnackbar('Salary updated successfully');
        } else {
          const msg = res?.message || 'Failed to save salary';
          enqueueSnackbar(msg, { variant: 'error' });
        }
      } catch (err) {
        console.error('Save salary error', err);
        enqueueSnackbar(err?.message || 'Failed to save salary', { variant: 'error' });
      } finally {
        setSaving(false);
      }
    })();
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
                  {loading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center">Loading employees…</TableCell>
                      </TableRow>
                    ) : fetchError ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ color: 'error.main' }}>{fetchError}</TableCell>
                      </TableRow>
                    ) : tableData.length === 0 ? (
                      <TableNoData isNotFound={true} />
                    ) : tableData
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
                          <IconButton onClick={() => handleOpenDialog(row, true)} size="small">
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
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
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      value={component.value}
                      onChange={(e) => updateComponentValueById(component.componentId, e.target.value)}
                      inputProps={{ step: '0.01' }}
                      sx={{ width: 140 }}
                    />
                  ) : (
                    <Typography variant="body2" fontWeight={600}>
                      ${component.value.toLocaleString()}
                    </Typography>
                  )}
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
                  {isEditing ? (
                    <TextField
                      size="small"
                      type="number"
                      value={component.value}
                      onChange={(e) => updateComponentValueById(component.componentId, e.target.value)}
                      inputProps={{ step: '0.01' }}
                      sx={{ width: 140 }}
                    />
                  ) : (
                    <Typography variant="body2" fontWeight={600}>
                      ${component.value.toLocaleString()}
                    </Typography>
                  )}
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
          {!isEditing ? (
            <Button variant="contained" startIcon={<Iconify icon="eva:edit-fill" />} onClick={() => setIsEditing(true)}>
              Edit Salary
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSaveSalary} startIcon={<Iconify icon="eva:save-outline" />} disabled={saving}>
              {saving ? 'Saving...' : 'Save Salary'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

