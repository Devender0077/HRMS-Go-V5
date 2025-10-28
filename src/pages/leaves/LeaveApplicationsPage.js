import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Tooltip,
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import leaveService from '../../services/api/leaveService';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
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
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import {
  LeaveTableToolbar,
  LeaveTableRow,
} from '../../sections/@dashboard/leave/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'leaveType', label: 'Leave Type', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'totalDays', label: 'Days', align: 'center' },
  { id: 'reason', label: 'Reason', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function LeaveApplicationsPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch leave applications
  useEffect(() => {
    fetchLeaves();
  }, [page, rowsPerPage]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      console.log('🔄 [Leave Applications] Fetching leaves...', { page: page + 1, limit: rowsPerPage });
      
      const response = await leaveService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });

      console.log('📥 [Leave Applications] Response:', response);

      if (response.success && response.data) {
        const leaves = response.data.leaves || [];
        console.log(`✅ [Leave Applications] Loaded ${leaves.length} leave applications`);
        setTableData(leaves);
      } else {
        console.log('⚠️ [Leave Applications] No data received');
        setTableData([]);
      }
    } catch (error) {
      console.error('❌ [Leave Applications] Error:', error);
      enqueueSnackbar('Error loading leave applications', { variant: 'error' });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterType, setFilterType] = useState('all');

  // Safety check for tableData
  const safeTableData = tableData || [];

  const dataFiltered = applyFilter({
    inputData: safeTableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterType,
  });

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterStatus !== 'all' || filterType !== 'all';

  const isNotFound = !dataFiltered.length && isFiltered;

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

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleFilterType = (event) => {
    setPage(0);
    setFilterType(event.target.value);
  };

  const handleApprove = async (id) => {
    try {
      const response = await leaveService.approve(id);
      if (response.success) {
        enqueueSnackbar('Leave approved successfully');
        fetchLeaves();
      } else {
        enqueueSnackbar(response.message || 'Failed to approve', { variant: 'error' });
      }
    } catch (error) {
      console.error('Approve error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await leaveService.reject(id);
      if (response.success) {
        enqueueSnackbar('Leave rejected successfully');
        fetchLeaves();
      } else {
        enqueueSnackbar(response.message || 'Failed to reject', { variant: 'error' });
      }
    } catch (error) {
      console.error('Reject error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await leaveService.delete(selectedId);
      if (response.success) {
        enqueueSnackbar('Leave request deleted successfully');
        fetchLeaves();
        handleCloseConfirm();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows) => {
    try {
      const deletePromises = selectedRows.map(id => leaveService.delete(id));
      await Promise.all(deletePromises);
      
      enqueueSnackbar(`${selectedRows.length} leave requests deleted successfully`);
      setSelected([]);
      fetchLeaves();
      handleCloseConfirm();
    } catch (error) {
      console.error('Delete rows error:', error);
      enqueueSnackbar('An error occurred', { variant: 'error' });
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterType('all');
  };

  return (
    <>
      <Helmet>
        <title> Leave: Applications | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Leave Applications"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Leaves', href: PATH_DASHBOARD.leaves.root },
            { name: 'Applications' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate(PATH_DASHBOARD.leaves.applications.new)}
            >
              Apply Leave
            </Button>
          }
        />

        <Card>
          <LeaveTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterStatus={filterStatus}
            filterType={filterType}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            onFilterType={handleFilterType}
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
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {loading ? (
                    <tr>
                      <td colSpan={TABLE_HEAD.length} style={{ textAlign: 'center', padding: '40px' }}>
                        <CircularProgress />
                      </td>
                    </tr>
                  ) : (
                    <>
                      {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <LeaveTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onApprove={() => handleApprove(row.id)}
                            onReject={() => handleReject(row.id)}
                            onDelete={() => handleDeleteClick(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, safeTableData.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </>
                  )}
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
          selectedId ? (
            "Are you sure you want to delete this leave request?"
          ) : (
            <>
              Are you sure want to delete <strong> {selected.length} </strong> items?
            </>
          )
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selectedId) {
                handleConfirmDelete();
              } else {
                handleDeleteRows(selected);
              }
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

function applyFilter({ inputData, comparator, filterName, filterStatus, filterType }) {
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
      (leave) =>
        leave.employeeName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        leave.employeeId.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((leave) => leave.status === filterStatus);
  }

  if (filterType !== 'all') {
    inputData = inputData.filter((leave) => leave.leaveType === filterType);
  }

  return inputData;
}

