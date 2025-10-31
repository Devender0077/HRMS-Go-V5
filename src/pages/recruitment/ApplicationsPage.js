import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
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
  Link,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import recruitmentService from '../../services/recruitmentService';
import apiClient from '../../utils/axios';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'applicant', label: 'Applicant', alignRight: false },
  { id: 'job_title', label: 'Job Title', alignRight: false },
  { id: 'applied_date', label: 'Applied Date', alignRight: false },
  { id: 'experience', label: 'Experience', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// (Removed static mock data — live data is fetched from the API)

// ----------------------------------------------------------------------

export default function ApplicationsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsApplication, setDetailsApplication] = useState(null);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      // also fetch job postings to map job_id -> job_title
      let jobsMap = {};
      try {
        const jobsRes = await recruitmentService.getJobPostings();
        let jobsPayload = [];
        if (jobsRes && jobsRes.success && Array.isArray(jobsRes.data)) jobsPayload = jobsRes.data;
        else if (Array.isArray(jobsRes)) jobsPayload = jobsRes;
        jobsPayload.forEach((j) => { jobsMap[String(j.id)] = j.title || j.job_title || j.name || 'Untitled'; });
      } catch (err) {
        console.warn('Failed to fetch job postings for mapping:', err);
      }

      if (response.success && Array.isArray(response.data)) {
        // normalize applications to UI shape
        const normalized = response.data.map((a) => ({
          id: a.id || a._id,
          applicant: {
            name: a.candidate_name || a.name || a.applicant_name || '',
            email: a.email || '',
            phone: a.phone || '',
          },
          job_title: a.job_title || jobsMap[String(a.job_id)] || a.job_title || (a.job && a.job.title) || 'Unknown',
          applied_date: a.applied_date || a.created_at || a.appliedAt || new Date().toISOString(),
          experience: a.experience || a.years_experience || '',
          status: a.status || 'applied',
          resume_url: a.resume_path || a.resume || '',
          cover_letter: a.cover_letter || a.coverLetter || '',
        }));
        setApplications(normalized);
      } else if (Array.isArray(response)) {
        // legacy shape
        setApplications(response);
      } else {
        setApplications([]);
        enqueueSnackbar('No applications found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      enqueueSnackbar('Failed to load applications', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenPopover = (event, application) => {
    setOpenPopover(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedApplication(null);
  };

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return '';
    if (resumePath.startsWith('http')) return resumePath;
    // apiClient.defaults.baseURL might be like 'http://localhost:8000/api'
    const base = apiClient.defaults?.baseURL || '';
    const stripped = base.replace(/\/api\/?$/, '');
    return `${stripped}${resumePath.startsWith('/') ? '' : '/'}${resumePath}`;
  };

  const handleViewDetails = (application) => {
    setDetailsApplication(application);
    setOpenDetails(true);
    handleClosePopover();
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setDetailsApplication(null);
  };

  const handleDownloadResume = (application) => {
    const path = application?.resume_url || application?.resume_path || application?.resume || '';
    const url = getResumeUrl(path);
    if (url) {
      window.open(url, '_blank');
    } else {
      enqueueSnackbar('Resume not available', { variant: 'warning' });
    }
    handleClosePopover();
  };

  // Handle status update
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await recruitmentService.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        enqueueSnackbar('Application status updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to update application status', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      enqueueSnackbar('Failed to update application status', { variant: 'error' });
    }
    handleClosePopover();
  };

  // Handle delete application
  const handleDeleteApplication = async (applicationId) => {
    try {
      const response = await recruitmentService.deleteApplication(applicationId);
      if (response.success) {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        enqueueSnackbar('Application deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete application', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      enqueueSnackbar('Failed to delete application', { variant: 'error' });
    }
    handleClosePopover();
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
      case 'applied':
        return 'warning';
      case 'screening':
        return 'warning';
      case 'shortlisted':
        return 'success';
      case 'interview':
      case 'interviewed':
        return 'info';
      case 'offer':
        return 'success';
      case 'under_review':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'hired':
        return 'primary';
      default:
        return 'default';
    }
  };

  // (status updates use handleUpdateStatus which triggers API + local state update)

  const filteredApplications = applications.filter((application) => {
    const term = (filterName || '').toString().trim().toLowerCase();
    if (!term) return true;

    const name = (application?.applicant?.name || application?.applicant_name || application?.name || '').toString().toLowerCase();
    const email = (application?.applicant?.email || application?.email || '').toString().toLowerCase();
    const phone = (application?.applicant?.phone || application?.phone || '').toString().toLowerCase();
    const jobTitle = (application?.job_title || application?.job?.title || '').toString().toLowerCase();
    const experience = (application?.experience || '').toString().toLowerCase();
    const cover = (application?.cover_letter || application?.coverLetter || '').toString().toLowerCase();
    const status = (application?.status || '').toString().toLowerCase();

    return (
      name.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      jobTitle.includes(term) ||
      experience.includes(term) ||
      cover.includes(term) ||
      status.includes(term)
    );
  });

  const isNotFound = !filteredApplications.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Job Applications | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Job Applications"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Recruitment', href: PATH_DASHBOARD.recruitment.root },
            { name: 'Applications' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:download-outline" />}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:filter-outline" />}
              >
                Filter
              </Button>
            </Stack>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search applications..."
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

          {loading && (
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="body2" color="text.secondary">Loading applications...</Typography>
            </Box>
          )}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={filteredApplications.length}
                />

                <TableBody>
                  {filteredApplications
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {row.applicant.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" noWrap>
                                {row.applicant.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.applicant.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.job_title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.applied_date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {row.experience}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status.replace('_', ' ')}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  {isNotFound && (
                    <TableNoData
                      isNotFound={isNotFound}
                      message={`No results found for "${filterName}"`}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredApplications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Details dialog */}
      <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth="sm">
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent dividers>
          {detailsApplication ? (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography variant="subtitle1">{detailsApplication.applicant?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{detailsApplication.applicant?.email}</Typography>
              <Typography variant="body2">Phone: {detailsApplication.applicant?.phone}</Typography>
              <Typography variant="body2">Job: {detailsApplication.job_title}</Typography>
              <Typography variant="body2">Applied: {new Date(detailsApplication.applied_date).toLocaleString()}</Typography>
              <Typography variant="body2">Experience: {detailsApplication.experience}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>Cover Letter: {detailsApplication.cover_letter}</Typography>
              <Box sx={{ mt: 1 }}>
                {detailsApplication.resume_url ? (
                  <Link href={getResumeUrl(detailsApplication.resume_url)} target="_blank" rel="noopener" underline="hover">Open Resume</Link>
                ) : (
                  <Typography variant="caption" color="text.secondary">No resume available</Typography>
                )}
              </Box>
            </Stack>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        <MenuItem onClick={() => handleViewDetails(selectedApplication)}>
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem onClick={() => handleDownloadResume(selectedApplication)}>
          <Iconify icon="eva:download-fill" />
          Download Resume
        </MenuItem>

        {(selectedApplication?.status === 'applied' || selectedApplication?.status === 'screening' || selectedApplication?.status === 'under_review') && (
          <MenuItem
            onClick={() => handleUpdateStatus(selectedApplication.id, 'screening')}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Shortlist
          </MenuItem>
        )}

        {selectedApplication?.status === 'screening' && (
          <MenuItem
            onClick={() => handleUpdateStatus(selectedApplication.id, 'interview')}
            sx={{ color: 'info.main' }}
          >
            <Iconify icon="eva:calendar-fill" />
            Schedule Interview
          </MenuItem>
        )}

        {(selectedApplication?.status === 'interview' || selectedApplication?.status === 'screening') && (
          <MenuItem
            onClick={() => handleUpdateStatus(selectedApplication.id, 'hired')}
            sx={{ color: 'primary.main' }}
          >
            <Iconify icon="eva:person-add-fill" />
            Hire
          </MenuItem>
        )}

        <MenuItem
          onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:close-circle-fill" />
          Reject
        </MenuItem>

        <MenuItem
          onClick={() => handleDeleteApplication(selectedApplication.id)}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-fill" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}