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
  CircularProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import attendanceService from '../../services/attendanceService';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import ConfirmDialog from '../../components/confirm-dialog';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
// sections
import {
  AttendanceTableToolbar,
  AttendanceTableRow,
} from '../../sections/@dashboard/attendance/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'clockIn', label: 'Clock In', align: 'left' },
  { id: 'clockOut', label: 'Clock Out', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'totalHours', label: 'Total Hours', align: 'center' },
  { id: 'overtime', label: 'Overtime', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function AttendanceRecordsPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch attendance records
  useEffect(() => {
    fetchAttendance();
    // We don't need to refetch on page/rowsPerPage — pagination is client-side
  }, [filterDate, filterStatus]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getAttendanceRecords({
        startDate: filterDate ? filterDate.toISOString().split('T')[0] : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });

      if (response.success && response.data) {
        setTableData(response.data.attendance || response.data || []);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      enqueueSnackbar('Error loading attendance records', { variant: 'error' });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Safety check for tableData
  const safeTableData = tableData || [];

  const dataFiltered = applyFilter({
    inputData: safeTableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterDate,
    filterStatus,
  });

  // Client-side pagination slice
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = dataFiltered.slice(start, end);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '' || filterDate !== null || filterStatus !== 'all';

  const isNotFound = !dataFiltered.length && isFiltered;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterDate = (date) => {
    setPage(0);
    setFilterDate(date);
  };

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterDate(null);
    setFilterStatus('all');
    setPage(0);
  };

  const handleViewDetails = (id) => {
    console.log('View details for:', id);
    // Navigate to details page or open modal
  };

  const handleEdit = (id) => {
    console.log('Regularize attendance:', id);
    // Navigate to regularization page
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await attendanceService.delete(selectedId);

      if (response.success) {
        enqueueSnackbar('Attendance record deleted successfully');
        fetchAttendance();
        handleCloseConfirm();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('An error occurred while deleting', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Attendance: Records | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Attendance Records"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Attendance', href: PATH_DASHBOARD.attendance.root },
            { name: 'Records' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:download-fill" />}
            >
              Export
            </Button>
          }
        />

        <Card>
          <AttendanceTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterDate={filterDate}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterDate={handleFilterDate}
            onFilterStatus={handleFilterStatus}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  onSort={onSort}
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
                      {paginatedData.map((row) => (
                        <AttendanceTableRow
                          key={row.id}
                          row={row}
                          onViewDetails={handleViewDetails}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                      />

                      <TableNoData isNotFound={isNotFound} />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}          // total rows after filtering
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
        content="Are you sure you want to delete this attendance record?"
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterDate, filterStatus }) {
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
      (record) =>
        (record.employeeName ?? '').toLowerCase().includes(filterName.toLowerCase()) ||
        (record.employeeId ?? '').toLowerCase().includes(filterName.toLowerCase())
    );
  }

  if (filterDate) {
    inputData = inputData.filter(
      (record) =>
        record?.date &&
        new Date(record.date).toDateString() === new Date(filterDate).toDateString()
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((record) => (record.status ?? '') === filterStatus);
  }

  return inputData;
}