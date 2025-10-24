import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// @mui
import {
  Container,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
// services
import attendanceService from '../../services/attendanceService';
// redux
import { selectUser } from '../../redux/slices/authSlice';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'current_time', label: 'Current Time', alignRight: false },
  { id: 'requested_time', label: 'Requested Time', alignRight: false },
  { id: 'reason', label: 'Reason', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function RegularizationsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [regularizations, setRegularizations] = useState([]);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedRegularization, setSelectedRegularization] = useState(null);
  
  // New Request Dialog
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newFormData, setNewFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    currentClockIn: '',
    currentClockOut: '',
    requestedClockIn: '',
    requestedClockOut: '',
    reason: '',
  });

  // View Dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewData, setViewData] = useState(null);

  // Edit Dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Reject Dialog
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRegularizations();
  }, [filterStatus]);

  const fetchRegularizations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await attendanceService.getRegularizations(params);
      if (response.success) {
        setRegularizations(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching regularizations:', error);
      enqueueSnackbar('Failed to load regularizations', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, regularization) => {
    setOpenPopover(event.currentTarget);
    setSelectedRegularization(regularization);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // New Request
  const handleOpenNewDialog = () => {
    setOpenNewDialog(true);
  };

  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
    setNewFormData({
      date: new Date().toISOString().split('T')[0],
      currentClockIn: '',
      currentClockOut: '',
      requestedClockIn: '',
      requestedClockOut: '',
      reason: '',
    });
  };

  const handleCreateRequest = async () => {
    try {
      const response = await attendanceService.createRegularization({
        employeeId: user?.id,
        date: newFormData.date,
        currentClockIn: newFormData.currentClockIn,
        currentClockOut: newFormData.currentClockOut,
        requestedClockIn: newFormData.requestedClockIn,
        requestedClockOut: newFormData.requestedClockOut,
        reason: newFormData.reason,
      });

      if (response.success) {
        enqueueSnackbar('Regularization request created successfully', { variant: 'success' });
        handleCloseNewDialog();
        fetchRegularizations();
      }
    } catch (error) {
      enqueueSnackbar('Failed to create regularization request', { variant: 'error' });
    }
  };

  // View
  const handleView = (regularization) => {
    setViewData(regularization);
    setOpenViewDialog(true);
    handleClosePopover();
  };

  // Edit
  const handleEdit = (regularization) => {
    setEditFormData({
      id: regularization.id,
      date: regularization.date,
      currentClockIn: regularization.currentClockIn || '',
      currentClockOut: regularization.currentClockOut || '',
      requestedClockIn: regularization.requestedClockIn || '',
      requestedClockOut: regularization.requestedClockOut || '',
      reason: regularization.reason || '',
    });
    setOpenEditDialog(true);
    handleClosePopover();
  };

  const handleSaveEdit = async () => {
    try {
      const { id, ...updateData } = editFormData;
      const response = await attendanceService.updateRegularization(id, updateData);
      
      if (response.success) {
        enqueueSnackbar('Regularization updated successfully', { variant: 'success' });
        setOpenEditDialog(false);
        fetchRegularizations();
      }
    } catch (error) {
      enqueueSnackbar('Failed to update regularization', { variant: 'error' });
    }
  };

  // Approve
  const handleApprove = async () => {
    try {
      const response = await attendanceService.approveRegularization(
        selectedRegularization.id,
        user?.id
      );
      
      if (response.success) {
        enqueueSnackbar('Regularization approved successfully', { variant: 'success' });
        handleClosePopover();
        fetchRegularizations();
      }
    } catch (error) {
      enqueueSnackbar('Failed to approve regularization', { variant: 'error' });
    }
  };

  // Reject
  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
    handleClosePopover();
  };

  const handleReject = async () => {
    try {
      const response = await attendanceService.rejectRegularization(
        selectedRegularization.id,
        user?.id,
        rejectionReason
      );
      
      if (response.success) {
        enqueueSnackbar('Regularization rejected successfully', { variant: 'success' });
        setOpenRejectDialog(false);
        setRejectionReason('');
        fetchRegularizations();
      }
    } catch (error) {
      enqueueSnackbar('Failed to reject regularization', { variant: 'error' });
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this regularization request?')) {
      return;
    }

    try {
      const response = await attendanceService.deleteRegularization(selectedRegularization.id);
      
      if (response.success) {
        enqueueSnackbar('Regularization deleted successfully', { variant: 'success' });
        handleClosePopover();
        fetchRegularizations();
      }
    } catch (error) {
      enqueueSnackbar('Failed to delete regularization', { variant: 'error' });
    }
  };

  const filteredRegularizations = regularizations.filter((reg) => {
    const employeeName = reg.Employee?.name || '';
    const reason = reg.reason || '';
    const searchTerm = filterName.toLowerCase();
    
    return (
      employeeName.toLowerCase().includes(searchTerm) ||
      reason.toLowerCase().includes(searchTerm)
    );
  });

  const isNotFound = !loading && filteredRegularizations.length === 0;

  return (
    <>
      <Helmet>
        <title>Attendance Regularizations | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Attendance Regularizations"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Attendance', href: PATH_DASHBOARD.attendance.root },
            { name: 'Regularizations' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenNewDialog}
            >
              New Request
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} direction="row" sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search employee or reason..."
              value={filterName}
              onChange={handleFilterName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHeadCustom headLabel={TABLE_HEAD} />
                    <TableBody>
                      {filteredRegularizations
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={row.Employee?.name} />
                                <Box>
                                  <Typography variant="subtitle2">{row.Employee?.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.Employee?.employee_id}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="caption">In: {row.currentClockIn || '-'}</Typography>
                                <Typography variant="caption">Out: {row.currentClockOut || '-'}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="caption" color="primary">In: {row.requestedClockIn || '-'}</Typography>
                                <Typography variant="caption" color="primary">Out: {row.requestedClockOut || '-'}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                {row.reason}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                color={getStatusColor(row.status)}
                                size="small"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                                <Iconify icon="eva:more-vertical-fill" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}

                      <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRegularizations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Container>

      {/* Actions Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={() => handleView(selectedRegularization)}>
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        {selectedRegularization?.status === 'pending' && (
          <>
            <MenuItem onClick={() => handleEdit(selectedRegularization)}>
              <Iconify icon="eva:edit-fill" />
              Edit
            </MenuItem>
            <MenuItem onClick={handleApprove}>
              <Iconify icon="eva:checkmark-circle-fill" />
              Approve
            </MenuItem>
            <MenuItem onClick={handleOpenRejectDialog}>
              <Iconify icon="eva:close-circle-fill" />
              Reject
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-fill" />
          Delete
        </MenuItem>
      </MenuPopover>

      {/* New Request Dialog */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>New Regularization Request</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newFormData.date}
              onChange={(e) => setNewFormData({ ...newFormData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="subtitle2">Current Time</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={newFormData.currentClockIn}
                onChange={(e) => setNewFormData({ ...newFormData, currentClockIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Clock Out"
                type="time"
                value={newFormData.currentClockOut}
                onChange={(e) => setNewFormData({ ...newFormData, currentClockOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Typography variant="subtitle2">Requested Time</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={newFormData.requestedClockIn}
                onChange={(e) => setNewFormData({ ...newFormData, requestedClockIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Clock Out"
                type="time"
                value={newFormData.requestedClockOut}
                onChange={(e) => setNewFormData({ ...newFormData, requestedClockOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              fullWidth
              label="Reason"
              multiline
              rows={4}
              value={newFormData.reason}
              onChange={(e) => setNewFormData({ ...newFormData, reason: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRequest}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Regularization Details</DialogTitle>
        <DialogContent>
          {viewData && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Employee</Typography>
                <Typography variant="body1">{viewData.Employee?.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography variant="body1">{viewData.date}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Current Time</Typography>
                <Typography variant="body1">In: {viewData.currentClockIn || '-'} | Out: {viewData.currentClockOut || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Requested Time</Typography>
                <Typography variant="body1">In: {viewData.requestedClockIn || '-'} | Out: {viewData.requestedClockOut || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Reason</Typography>
                <Typography variant="body1">{viewData.reason}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip label={viewData.status} color={getStatusColor(viewData.status)} size="small" />
              </Box>
              {viewData.approvedBy && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Approved/Rejected By</Typography>
                  <Typography variant="body1">User ID: {viewData.approvedBy}</Typography>
                </Box>
              )}
              {viewData.rejectionReason && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Rejection Reason</Typography>
                  <Typography variant="body1">{viewData.rejectionReason}</Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Regularization Request</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={editFormData.date}
              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="subtitle2">Current Time</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={editFormData.currentClockIn}
                onChange={(e) => setEditFormData({ ...editFormData, currentClockIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Clock Out"
                type="time"
                value={editFormData.currentClockOut}
                onChange={(e) => setEditFormData({ ...editFormData, currentClockOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Typography variant="subtitle2">Requested Time</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={editFormData.requestedClockIn}
                onChange={(e) => setEditFormData({ ...editFormData, requestedClockIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Clock Out"
                type="time"
                value={editFormData.requestedClockOut}
                onChange={(e) => setEditFormData({ ...editFormData, requestedClockOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <TextField
              fullWidth
              label="Reason"
              multiline
              rows={4}
              value={editFormData.reason}
              onChange={(e) => setEditFormData({ ...editFormData, reason: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Regularization Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Rejection Reason"
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject}>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

