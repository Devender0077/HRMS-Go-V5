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
  TableContainer,
  CircularProgress,
  MenuItem,
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
import MenuPopover from '../../components/menu-popover';
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
import AttendanceDetailsDialog from '../../sections/@dashboard/attendance/AttendanceDetailsDialog';
// utils
import * as XLSX from 'xlsx';

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
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openExportMenu, setOpenExportMenu] = useState(null);

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const navigate = useNavigate();

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
    const attendance = tableData.find((row) => row.id === id);
    if (attendance) {
      setSelectedAttendance(attendance);
      setOpenDetails(true);
    }
  };

  const handleEdit = (id) => {
    // Navigate to regularization page with attendance ID
    navigate(`/dashboard/attendance/regularizations?attendance_id=${id}`);
  };

  const handleExport = (format) => {
    setOpenExportMenu(null);
    
    try {
      const exportData = dataFiltered.map((row) => ({
        'Employee ID': row.employeeId || row.employee_id || 'N/A',
        'Employee Name': row.employeeName || row.employee_name || 'N/A',
        'Date': row.date,
        'Clock In': row.clockIn || '-',
        'Clock Out': row.clockOut || '-',
        'Total Hours': row.totalHours || row.total_hours || '0',
        'Overtime': row.overtime || '0',
        'Status': row.status || 'unknown',
        'Location': row.clockInLocation || row.clock_in_location || '-',
      }));

      if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, `attendance_records_${new Date().toISOString().split('T')[0]}.xlsx`);
        enqueueSnackbar('Exported to Excel successfully', { variant: 'success' });
      } else if (format === 'csv') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `attendance_records_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        enqueueSnackbar('Exported to CSV successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Export error:', error);
      enqueueSnackbar('Failed to export data', { variant: 'error' });
    }
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
              onClick={(e) => setOpenExportMenu(e.currentTarget)}
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

      <AttendanceDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        attendance={selectedAttendance}
      />

      <MenuPopover
        open={Boolean(openExportMenu)}
        anchorEl={openExportMenu}
        onClose={() => setOpenExportMenu(null)}
      >
        <MenuItem onClick={() => handleExport('excel')}>
          <Iconify icon="vscode-icons:file-type-excel" sx={{ mr: 2 }} />
          Export to Excel
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <Iconify icon="vscode-icons:file-type-csv" sx={{ mr: 2 }} />
          Export to CSV
        </MenuItem>
      </MenuPopover>
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