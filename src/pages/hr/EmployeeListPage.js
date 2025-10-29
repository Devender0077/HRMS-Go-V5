import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import employeeService from '../../services/api/employeeService';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { EmployeeTableToolbar, EmployeeTableRow } from '../../sections/@dashboard/employee/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Employee', align: 'left' },
  { id: 'employeeId', label: 'Employee ID', align: 'left' },
  { id: 'department', label: 'Department', align: 'left' },
  { id: 'designation', label: 'Designation', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'systemAccess', label: 'System Access', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '', label: 'Actions', align: 'right' },
];

// Removed mock data - using real data from database

// ----------------------------------------------------------------------

export default function EmployeeListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterDepartment, setFilterDepartment] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        console.log('📋 Fetching employees with filters:', { filterName, filterDepartment, filterStatus });
        
        const response = await employeeService.getAllEmployees({
          search: filterName,
          department: filterDepartment,
          status: filterStatus,
        });

        console.log('📋 Employee API response:', response);

        if (response.success) {
          const employees = response.employees || response.data || [];
          console.log('✅ Loaded', employees.length, 'employees');
          setTableData(employees);
        } else {
          console.warn('⚠️ API returned success: false', response.message);
          setTableData([]);
          if (response.message) {
            enqueueSnackbar(response.message, { variant: 'warning' });
          }
        }
      } catch (error) {
        console.error('❌ Error fetching employees:', error);
        console.error('Error response:', error.response?.data);
        
        // Check if it's a permission error
        if (error.response?.status === 403) {
          enqueueSnackbar('You do not have permission to view all employees. Login as HR/Admin to see all employees.', { variant: 'warning' });
        } else {
          enqueueSnackbar('Error loading employees', { variant: 'error' });
        }
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [filterName, filterDepartment, filterStatus, enqueueSnackbar]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterDepartment,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterDepartment !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterDepartment) ||
    (!dataFiltered.length && !!filterStatus);

  // Safety check for tableData
  const safeTableData = tableData || [];

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterDepartment = (event) => {
    setPage(0);
    setFilterDepartment(event.target.value);
  };

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      const response = await employeeService.deleteEmployee(id);
      
      if (response.success) {
        const deleteRow = safeTableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);
        enqueueSnackbar('Employee deleted successfully');

        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      } else {
        enqueueSnackbar(response.message || 'Failed to delete employee', { variant: 'error' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows) => {
    try {
      // Delete all selected employees
      const deletePromises = selectedRows.map(id => employeeService.deleteEmployee(id));
      await Promise.all(deletePromises);

      const deleteRows = safeTableData.filter((row) => !selectedRows.includes(row.id));
      setSelected([]);
      setTableData(deleteRows);
      enqueueSnackbar(`${selectedRows.length} employees deleted successfully`);

      if (page > 0) {
        if (selectedRows.length === dataInPage.length) {
          setPage(page - 1);
        } else if (selectedRows.length === dataFiltered.length) {
          setPage(0);
        } else if (selectedRows.length > dataInPage.length) {
          const newPage = Math.ceil((dataFiltered.length - selectedRows.length) / rowsPerPage) - 1;
          setPage(newPage);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('Failed to delete some employees', { variant: 'error' });
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.hr.employees.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.hr.employees.view(id));
  };

  const handleGrantAccess = async (id) => {
    try {
      console.log('🔐 Granting system access to employee:', id);
      const response = await employeeService.grantSystemAccess(id);
      
      if (response.success) {
        // Show generated password to HR
        const password = response.data?.credentials?.password || response.data?.password;
        enqueueSnackbar(
          password 
            ? `System access granted! Password: ${password} (sent to employee email)`
            : 'System access granted successfully',
          { variant: 'success' }
        );
        
        // Refresh employee list
        const employeesResponse = await employeeService.getAllEmployees({
          search: filterName,
          department: filterDepartment !== 'all' ? filterDepartment : '',
          status: filterStatus !== 'all' ? filterStatus : '',
        });

        if (employeesResponse.success && employeesResponse.data) {
          const employees = Array.isArray(employeesResponse.data) 
            ? employeesResponse.data 
            : employeesResponse.data.employees || [];
          setTableData(employees);
        }
      } else {
        enqueueSnackbar(response.message || 'Failed to grant system access', { variant: 'error' });
      }
    } catch (error) {
      console.error('Grant access error:', error);
      enqueueSnackbar('An error occurred while granting system access', { variant: 'error' });
    }
  };

  const handleRevokeAccess = async (id) => {
    try {
      console.log('⛔ Revoking system access for employee:', id);
      const response = await employeeService.revokeSystemAccess(id);
      
      if (response.success) {
        enqueueSnackbar('System access revoked successfully', { variant: 'success' });
        
        // Refresh employee list
        const employeesResponse = await employeeService.getAllEmployees({
          search: filterName,
          department: filterDepartment !== 'all' ? filterDepartment : '',
          status: filterStatus !== 'all' ? filterStatus : '',
        });

        if (employeesResponse.success && employeesResponse.data) {
          const employees = Array.isArray(employeesResponse.data) 
            ? employeesResponse.data 
            : employeesResponse.data.employees || [];
          setTableData(employees);
        }
      } else {
        enqueueSnackbar(response.message || 'Failed to revoke system access', { variant: 'error' });
      }
    } catch (error) {
      console.error('Revoke access error:', error);
      enqueueSnackbar('An error occurred while revoking system access', { variant: 'error' });
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterDepartment('all');
    setFilterStatus('all');
  };

  return (
    <>
      <Helmet>
        <title> Employees: List | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Employee List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Employees', href: PATH_DASHBOARD.hr.employees.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate(PATH_DASHBOARD.hr.employees.new)}
            >
              New Employee
            </Button>
          }
        />

        <Card>
          <EmployeeTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterDepartment={filterDepartment}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterDepartment={handleFilterDepartment}
            onFilterStatus={handleFilterStatus}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={safeTableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  safeTableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={safeTableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      safeTableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EmployeeTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onGrantAccess={() => handleGrantAccess(row.id)}
                        onRevokeAccess={() => handleRevokeAccess(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, safeTableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterDepartment, filterStatus }) {
  // Handle undefined or null inputData
  if (!inputData || !Array.isArray(inputData)) {
    return [];
  }
  
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (employee) =>
        employee.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        employee.employeeId.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterDepartment !== 'all') {
    inputData = inputData.filter((employee) => employee.department === filterDepartment);
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((employee) => employee.status === filterStatus);
  }

  return inputData;
}

