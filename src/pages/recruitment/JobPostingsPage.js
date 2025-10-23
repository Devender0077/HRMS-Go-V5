import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  Avatar,
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

  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch job postings
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobPostings();
      if (response.success) {
        setJobPostings(response.data);
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
  };

  // Load data on component mount
  useEffect(() => {
    fetchJobPostings();
  }, []);

  const handleOpenPopover = (event, job) => {
    setOpenPopover(event.currentTarget);
    setSelectedJob(job);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedJob(null);
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

  const isNotFound = !filteredJobPostings.length && !!filterName;

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
              to={PATH_DASHBOARD.recruitment.jobs + '/new'}
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
            console.log('View job posting:', selectedJob);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Edit job posting:', selectedJob);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('View applications:', selectedJob);
            handleClosePopover();
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
    </>
  );
}