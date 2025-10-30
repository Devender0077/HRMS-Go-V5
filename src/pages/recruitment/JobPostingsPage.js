import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import recruitmentService from '../../services/recruitmentService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Job Title', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'employment_type', label: 'Type', alignRight: false },
  { id: 'positions', label: 'Positions', alignRight: false },
  { id: 'applications', label: 'Applications', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'posted_date', label: 'Posted Date', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_JOB_POSTINGS = [
  {
    id: 1,
    title: 'Senior Software Developer',
    department: 'Information Technology',
    location: 'New York, NY',
    employment_type: 'full_time',
    positions: 2,
    applications: 15,
    status: 'open',
    posted_date: '2024-01-15',
    closing_date: '2024-02-15',
    salary_range: '$80,000 - $120,000',
    experience_required: '3-5 years',
  },
  {
    id: 2,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    employment_type: 'full_time',
    positions: 1,
    applications: 8,
    status: 'open',
    posted_date: '2024-01-14',
    closing_date: '2024-02-14',
    salary_range: '$60,000 - $90,000',
    experience_required: '2-4 years',
  },
  {
    id: 3,
    title: 'HR Intern',
    department: 'Human Resources',
    location: 'Chicago, IL',
    employment_type: 'intern',
    positions: 3,
    applications: 25,
    status: 'closed',
    posted_date: '2024-01-10',
    closing_date: '2024-01-25',
    salary_range: '$15,000 - $20,000',
    experience_required: '0-1 years',
  },
  {
    id: 4,
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Remote',
    employment_type: 'full_time',
    positions: 5,
    applications: 12,
    status: 'on_hold',
    posted_date: '2024-01-12',
    closing_date: '2024-02-12',
    salary_range: '$40,000 - $60,000',
    experience_required: '1-3 years',
  },
];

// ----------------------------------------------------------------------

export default function JobPostingsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openApplicationsDialog, setOpenApplicationsDialog] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', department: '', location: '', employment_type: '', positions: 1, salary_range: '', experience_required: '', description: '' });
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Fetch job postings
  const fetchJobPostings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobPostings();

      // Accept multiple shapes: { success, data }, { data: [...] }, or array
      let payload = null;
      if (response == null) payload = null;
      else if (Array.isArray(response)) payload = response;
      else if (response.success && response.data) payload = response.data;
      else if (response.data && Array.isArray(response.data)) payload = response.data;
      else if (response.jobs && Array.isArray(response.jobs)) payload = response.jobs;
      else if (response.payload && Array.isArray(response.payload)) payload = response.payload;
      else payload = null;

      if (payload && Array.isArray(payload)) {
        // Normalize each job object to expected table fields
        const normalized = payload.map((j, idx) => ({
          id: j.id || j._id || j.jobId || j.job_id || `${j.title || 'job'}-${idx}`,
          title: j.title || j.job_title || j.name || 'Untitled',
          department: j.department || j.departmentName || j.dept || 'General',
          location: j.location || j.locationName || j.city || 'Remote',
          employment_type: j.employment_type || j.type || j.job_type || 'full_time',
          positions: Number(j.positions ?? j.openings ?? 1),
          applications: Number(j.applications ?? j.app_count ?? 0),
          status: j.status || j.state || 'open',
          posted_date: j.posted_date || j.createdAt || j.postedAt || new Date().toISOString(),
          closing_date: j.closing_date || j.closingAt || j.closesAt || null,
          salary_range: j.salary_range || j.salary || j.compensation || '',
          experience_required: j.experience_required || j.experience || '',
        }));

        setJobPostings(normalized);
      } else {
        // Use mock data as fallback
        setJobPostings(MOCK_JOB_POSTINGS);
        enqueueSnackbar('Using sample data - API not available', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setJobPostings(MOCK_JOB_POSTINGS);
      enqueueSnackbar('Using sample data - API not available', { variant: 'info' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  // Load data on component mount
  useEffect(() => {
    fetchJobPostings();
  }, [fetchJobPostings]);

  // If navigated here after creating a job, refresh the list
  useEffect(() => {
    if (location.state && location.state.refresh) {
      // refetch list
      fetchJobPostings();
      // clear the navigation state so refresh doesn't repeat
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, fetchJobPostings, navigate, location.pathname]);

  const handleOpenPopover = (event, job) => {
    setOpenPopover(event.currentTarget);
    setSelectedJob(job);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedJob(null);
  };

  // Modals: open/close handlers
  const handleOpenView = (job) => {
    setSelectedJob(job);
    setOpenViewDialog(true);
  };

  const handleCloseView = () => {
    setOpenViewDialog(false);
    setSelectedJob(null);
  };

  const handleOpenEdit = (job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      employment_type: job.employment_type || 'full_time',
      positions: job.positions || 1,
      salary_range: job.salary_range || '',
      experience_required: job.experience_required || '',
      description: job.description || '',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedJob(null);
    setEditForm({ title: '', department: '', location: '', employment_type: '', positions: 1, salary_range: '', experience_required: '', description: '' });
  };

  const handleOpenApplications = async (job) => {
    setSelectedJob(job);
    setAppsLoading(true);
    try {
      const res = await recruitmentService.getJobApplications();
      let payload = [];
      if (res && res.success && Array.isArray(res.data)) payload = res.data;
      else if (Array.isArray(res)) payload = res;

      // filter by job id - try multiple possible field names
      const jobIdKey = job.id;
      const filtered = payload.filter((a) => a.job_id === jobIdKey || a.jobId === jobIdKey || a.job === jobIdKey || a.job_id === String(jobIdKey) || a.jobId === String(jobIdKey));
      setApplications(filtered);
    } catch (error) {
      console.error('Error fetching applications for job:', error);
      setApplications([]);
    } finally {
      setAppsLoading(false);
      setOpenApplicationsDialog(true);
    }
  };

  const handleCloseApplications = () => {
    setOpenApplicationsDialog(false);
    setSelectedJob(null);
    setApplications([]);
  };

  const handleSubmitEdit = async () => {
    if (!selectedJob) return;
    try {
      const payload = {
        title: editForm.title,
        department: editForm.department,
        location: editForm.location,
        employment_type: editForm.employment_type,
        positions: Number(editForm.positions),
        salary_range: editForm.salary_range,
        experience_required: editForm.experience_required,
        description: editForm.description,
      };
      const res = await recruitmentService.updateJobPosting(selectedJob.id, payload);
      if (res && res.success) {
        setJobPostings((prev) => prev.map((j) => (j.id === selectedJob.id ? { ...j, ...payload } : j)));
        enqueueSnackbar('Job posting updated', { variant: 'success' });
        handleCloseEdit();
      } else {
        enqueueSnackbar(res?.message || 'Failed to update job posting', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating job posting:', error);
      enqueueSnackbar('Failed to update job posting', { variant: 'error' });
    }
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
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
      case 'open':
        return 'success';
      case 'closed':
        return 'error';
      case 'on_hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch (type) {
      case 'full_time':
        return 'primary';
      case 'part_time':
        return 'secondary';
      case 'contract':
        return 'warning';
      case 'intern':
        return 'info';
      default:
        return 'default';
    }
  };

  // CRUD Operations
  const handleDeleteJob = async (jobId) => {
    try {
      const response = await recruitmentService.deleteJobPosting(jobId);
      if (response.success) {
        setJobPostings(prev => prev.filter(job => job.id !== jobId));
        enqueueSnackbar('Job posting deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete job posting', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting job posting:', error);
      enqueueSnackbar('Failed to delete job posting', { variant: 'error' });
    }
    handleClosePopover();
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const job = jobPostings.find(j => j.id === jobId);
      if (!job) return;

      const response = await recruitmentService.updateJobPosting(jobId, {
        ...job,
        status: newStatus
      });
      
      if (response.success) {
        setJobPostings(prev => 
          prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
        );
        enqueueSnackbar('Job status updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to update job status', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      enqueueSnackbar('Failed to update job status', { variant: 'error' });
    }
    handleClosePopover();
  };

  const filteredJobPostings = jobPostings.filter((job) =>
    job.title.toLowerCase().includes(filterName.toLowerCase()) ||
    job.department.toLowerCase().includes(filterName.toLowerCase()) ||
    job.location.toLowerCase().includes(filterName.toLowerCase())
  );

  // const isNotFound intentionally omitted; TableNoData prop uses direct check

  return (
    <>
      <Helmet>
        <title>Job Postings | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Job Postings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Recruitment', href: PATH_DASHBOARD.recruitment.root },
            { name: 'Job Postings' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.recruitment.jobs.postings.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Job Posting
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search job postings..."
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
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={filteredJobPostings.length}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Loading job postings...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredJobPostings.length === 0 ? (
                    <TableNoData isNotFound={filteredJobPostings.length === 0} />
                  ) : (
                    filteredJobPostings
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {row.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.salary_range}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.department}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.employment_type.replace('_', ' ')}
                            color={getEmploymentTypeColor(row.employment_type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.positions}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.applications}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status.replace('_', ' ')}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.posted_date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredJobPostings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            // Open view dialog for the selected job
            handleClosePopover();
            if (selectedJob) {
              handleOpenView(selectedJob);
            }
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Open edit dialog for the selected job
            handleClosePopover();
            if (selectedJob) {
              handleOpenEdit(selectedJob);
            }
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Open applications dialog for the selected job
            handleClosePopover();
            if (selectedJob) {
              handleOpenApplications(selectedJob);
            }
          }}
        >
          <Iconify icon="eva:people-fill" />
          View Applications
        </MenuItem>

        {selectedJob?.status === 'open' && (
          <MenuItem
            onClick={() => {
              handleUpdateStatus(selectedJob.id, 'on_hold');
            }}
          >
            <Iconify icon="eva:pause-fill" />
            Put on Hold
          </MenuItem>
        )}

        {selectedJob?.status === 'on_hold' && (
          <MenuItem
            onClick={() => {
              handleUpdateStatus(selectedJob.id, 'open');
            }}
          >
            <Iconify icon="eva:play-fill" />
            Reopen
          </MenuItem>
        )}

        {selectedJob?.status === 'open' && (
          <MenuItem
            onClick={() => {
              handleUpdateStatus(selectedJob.id, 'closed');
            }}
          >
            <Iconify icon="eva:checkmark-circle-fill" />
            Close
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            console.log('Duplicate job posting:', selectedJob);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:copy-fill" />
          Duplicate
        </MenuItem>

        <MenuItem 
          sx={{ color: 'error.main' }}
          onClick={() => {
            if (selectedJob) {
              handleDeleteJob(selectedJob.id);
            }
          }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="h6">{selectedJob.title}</Typography>
              <Typography variant="body2" color="text.secondary">{selectedJob.department}</Typography>
              <Typography variant="body2">Location: {selectedJob.location}</Typography>
              <Typography variant="body2">Type: {selectedJob.employment_type?.replace('_', ' ')}</Typography>
              <Typography variant="body2">Positions: {selectedJob.positions}</Typography>
              <Typography variant="body2">Salary: {selectedJob.salary_range || '-'}</Typography>
              <Typography variant="body2">Experience: {selectedJob.experience_required || '-'}</Typography>
              <Typography variant="body2">Status: {selectedJob.status}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedJob.description || ''}</Typography>
            </Stack>
          ) : (
            <Typography>No job selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Job Posting</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Job Title" fullWidth value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            <TextField label="Department" fullWidth value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
            <TextField label="Location" fullWidth value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            <TextField label="Employment Type" select fullWidth value={editForm.employment_type} onChange={(e) => setEditForm({ ...editForm, employment_type: e.target.value })}>
              <MenuItem value="full_time">Full Time</MenuItem>
              <MenuItem value="part_time">Part Time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="intern">Intern</MenuItem>
            </TextField>
            <TextField label="Positions" type="number" value={editForm.positions} onChange={(e) => setEditForm({ ...editForm, positions: e.target.value })} />
            <TextField label="Salary Range" fullWidth value={editForm.salary_range} onChange={(e) => setEditForm({ ...editForm, salary_range: e.target.value })} />
            <TextField label="Experience Required" fullWidth value={editForm.experience_required} onChange={(e) => setEditForm({ ...editForm, experience_required: e.target.value })} />
            <TextField label="Description" fullWidth multiline minRows={4} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog open={openApplicationsDialog} onClose={handleCloseApplications} maxWidth="md" fullWidth>
        <DialogTitle>Applications for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {appsLoading ? (
            <Typography>Loading applications...</Typography>
          ) : applications && applications.length > 0 ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {applications.map((app) => (
                <Box key={app.id || app._id || app.applicationId} sx={{ p: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2">{app.candidate_name || app.name || app.applicant_name || 'Unnamed'}</Typography>
                  <Typography variant="caption" color="text.secondary">Status: {app.status || app.state || 'unknown'}</Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography>No applications found for this job.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplications}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}