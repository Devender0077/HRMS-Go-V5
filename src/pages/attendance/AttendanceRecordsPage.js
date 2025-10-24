import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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

  // Employee name mapping from calendar API
  const [employeeNameMap, setEmployeeNameMap] = useState({});

  // ---------- NORMALIZER: make rows look like the calendar page & also support nested ----------
  const normalizeAttendanceRecord = (raw = {}) => {
    const employeeObj = raw.employee || raw.emp || raw.user || {};
    const assembledFullName = [raw.firstName, raw.lastName].filter(Boolean).join(' ');

    // candidates for name
    const nameCandidates = [
      raw.employeeName,
      raw.name,
      raw.fullName,
      employeeObj.name,
      employeeObj.fullName,
      assembledFullName,
    ].filter((v) => typeof v === 'string' && v.trim().length > 0);

    const name = nameCandidates.length ? nameCandidates[0].trim() : '';

    // candidates for id
    const idCandidates = [
      raw.employeeId,
      raw.empId,
      employeeObj.empId,
      employeeObj.id,
      raw.userId,
      raw.id,
    ].filter((v) => v !== undefined && v !== null && String(v).trim().length > 0);

    const empId = idCandidates.length ? String(idCandidates[0]).trim() : '';

    // ensure nested employee object with name/empId exists
    const employee = {
      ...(employeeObj || {}),
      name,
      empId,
    };

    // stable primary key candidate
    const pk =
      raw.id ??
      raw._id ??
      `${empId || 'emp'}_${raw.date || raw.attendanceDate || Math.random().toString(36).slice(2)}`;

    // harmonize commonly used date/fields
    const date = raw.date || raw.attendanceDate || raw.clockDate || null;

    return {
      ...raw,
      id: pk,
      date,
      employee,              // nested like calendar page may expect
      employeeName: name,    // flat field for easy rendering/export
      name,                  // alias (some rows/components look for name)
      employeeId: empId,     // flat ID
      empId,                 // alias to match calendar shape
    };
  };

  // Fetch employee names from calendar API (once on mount)
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        // Use current year/month for calendar API
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const calendarData = await attendanceService.getCalendar({ year, month, department: 'all' });
        if (Array.isArray(calendarData)) {
          const map = {};
          calendarData.forEach(emp => {
            if (emp.empId) map[String(emp.empId).trim()] = emp.name;
          });
          setEmployeeNameMap(map);
        }
      } catch (e) {
        // ignore error, fallback to record names
      }
    };
    fetchEmployeeNames();
  }, []);

  // Fetch attendance records
  const fetchAttendance = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await attendanceService.getAttendanceRecords({
        startDate: filterDate ? filterDate.toISOString().split('T')[0] : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });

      if (response && response.success && response.data) {
        const raw = response.data.attendance || response.data || [];
        const mapped = Array.isArray(raw) ? raw.map(normalizeAttendanceRecord) : [];
        setTableData(mapped);
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
  }, [filterDate, filterStatus, enqueueSnackbar]);

  useEffect(() => {
    fetchAttendance();
    // client-side pagination, no need to refetch on page/rowsPerPage
  }, [fetchAttendance]);

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
  };

  const handleEdit = (id) => {
    console.log('Regularize attendance:', id);
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

      if (response && response.success) {
        enqueueSnackbar('Attendance record deleted successfully');
        fetchAttendance();
        handleCloseConfirm();
      } else {
        enqueueSnackbar((response && response.message) || 'Failed to delete', { variant: 'error' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      enqueueSnackbar('An error occurred while deleting', { variant: 'error' });
    }
  };

  // ------------------------------------------------------------------
  // EXPORT: prepare data & export as Excel
  // ------------------------------------------------------------------

  const toNumberOrNull = (val) => {
    if (typeof val === 'number') return Number.isFinite(val) ? val : null;
    if (typeof val === 'string') {
      const hhmm = val.match(/^(\d{1,2}):(\d{2})$/);
      if (hhmm) {
        const h = parseInt(hhmm[1], 10);
        const m = parseInt(hhmm[2], 10);
        return Number.isFinite(h) && Number.isFinite(m) ? h + m / 60 : null;
      }
      const cleaned = val.replace(/[^0-9.-]/g, '');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const mapRowForExport = (r) => {
    const totalHoursNum = toNumberOrNull(r.totalHours);
    const overtimeNum = toNumberOrNull(r.overtime);
    // Use employeeNameMap for name if available
    const empId = r.employeeId || r.empId || (r.employee && r.employee.empId) || '';
    const nameFromMap = empId && employeeNameMap[empId] ? employeeNameMap[empId] : null;
    return {
      Employee: nameFromMap || r.employeeName || r.name || (r.employee && r.employee.name) || '',
      'Employee ID': empId,
      Date: r.date ? new Date(r.date).toLocaleDateString() : '',
      'Clock In': r.clockIn ?? '',
      'Clock Out': r.clockOut ?? '',
      Location: r.clockInLocation ?? '',
      'Total Hours':
        totalHoursNum !== null
          ? Number(totalHoursNum.toFixed(2))
          : (typeof r.totalHours === 'string' ? r.totalHours : ''),
      Overtime:
        overtimeNum !== null
          ? Number(overtimeNum.toFixed(2))
          : (typeof r.overtime === 'string' ? r.overtime : ''),
      Status: (r.status ?? '').replace(/_/g, ' '),
      'Clock-In IP': r.clockInIp ?? '',
    };
  };

  const handleExport = async () => {
    try {
      const exportRows = dataFiltered.map(mapRowForExport);

      if (!exportRows.length) {
        enqueueSnackbar('No rows to export.', { variant: 'info' });
        return;
      }

      const XLSX = await import('xlsx'); // no .default

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

      const fileName = `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);

      enqueueSnackbar('Exported to Excel', { variant: 'success' });
    } catch (err) {
      console.error('Export error:', err);
      enqueueSnackbar('Failed to export', { variant: 'error' });
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
              onClick={handleExport}
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
                      {paginatedData.map((row, idx) => {
                        // Use employeeNameMap for display
                        const empIdRaw = row.employeeId || row.empId || (row.employee && row.employee.empId) || '';
                        const empId = String(empIdRaw).trim();
                        const nameFromMap = empId && employeeNameMap[empId] ? employeeNameMap[empId] : null;
                        const rowWithName = { ...row, employeeName: nameFromMap || row.employeeName || row.name || (row.employee && row.employee.name) || empId };
                        return (
                          <AttendanceTableRow
                            key={row.id || `${empId || 'emp'}-${row.date || idx}`}
                            row={rowWithName}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                          />
                        );
                      })}

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
    const q = filterName.toLowerCase();
    inputData = inputData.filter((record) => {
      const name =
        (record.employee && record.employee.name) ||
        record.employeeName ||
        record.name ||
        '';
      const id =
        String(record.employeeId || record.empId || (record.employee && record.employee.empId) || '').toLowerCase();
      return name.toLowerCase().includes(q) || id.includes(q);
    });
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