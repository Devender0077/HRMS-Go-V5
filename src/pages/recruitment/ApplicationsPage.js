import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import recruitmentService from '../../services/recruitmentService';
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

const MOCK_APPLICATIONS = [
  {
    id: 1,
    applicant: {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0101',
    },
    job_title: 'Senior Software Developer',
    applied_date: '2024-01-20',
    experience: '4 years',
    status: 'under_review',
    resume_url: '/resumes/alice_johnson.pdf',
    cover_letter: 'I am very interested in this position...',
  },
  {
    id: 2,
    applicant: {
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1-555-0102',
    },
    job_title: 'Marketing Manager',
    applied_date: '2024-01-19',
    experience: '3 years',
    status: 'shortlisted',
    resume_url: '/resumes/bob_smith.pdf',
    cover_letter: 'I have extensive experience in marketing...',
  },
  {
    id: 3,
    applicant: {
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1-555-0103',
    },
    job_title: 'HR Intern',
    applied_date: '2024-01-18',
    experience: '1 year',
    status: 'interviewed',
    resume_url: '/resumes/carol_davis.pdf',
    cover_letter: 'I am excited about this internship opportunity...',
  },
  {
    id: 4,
    applicant: {
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0104',
    },
    job_title: 'Senior Software Developer',
    applied_date: '2024-01-17',
    experience: '5 years',
    status: 'rejected',
    resume_url: '/resumes/david_wilson.pdf',
    cover_letter: 'I am a senior developer with 5 years of experience...',
  },
];

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

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      if (response.success && Array.isArray(response.data)) {
        setApplications(response.data);
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
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenPopover = (event, application) => {
    setOpenPopover(event.currentTarget);
    setSelectedApplication(application);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedApplication(null);
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
      case 'shortlisted':
        return 'success';
      case 'interviewed':
        return 'info';
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

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? { ...app, status: newStatus }
          : app
      )
    );
    handleClosePopover();
  };

  const filteredApplications = applications.filter((application) =>
    application.applicant.name.toLowerCase().includes(filterName.toLowerCase()) ||
    application.job_title.toLowerCase().includes(filterName.toLowerCase()) ||
    application.applicant.email.toLowerCase().includes(filterName.toLowerCase())
  );

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

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 180 }}
      >
        <MenuItem
          onClick={() => {
            console.log('View application:', selectedApplication);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Download resume:', selectedApplication);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:download-fill" />
          Download Resume
        </MenuItem>

        {selectedApplication?.status === 'under_review' && (
          <MenuItem
            onClick={() => handleUpdateStatus(selectedApplication.id, 'shortlisted')}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Shortlist
          </MenuItem>
        )}

        {selectedApplication?.status === 'shortlisted' && (
          <MenuItem
            onClick={() => handleUpdateStatus(selectedApplication.id, 'interviewed')}
            sx={{ color: 'info.main' }}
          >
            <Iconify icon="eva:calendar-fill" />
            Schedule Interview
          </MenuItem>
        )}

        {selectedApplication?.status === 'interviewed' && (
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