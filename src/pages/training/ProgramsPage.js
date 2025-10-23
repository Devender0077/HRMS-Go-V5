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
  LinearProgress,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import trainingService from '../../services/trainingService';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Program Name', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'duration', label: 'Duration', alignRight: false },
  { id: 'participants', label: 'Participants', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'start_date', label: 'Start Date', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_PROGRAMS = [
  {
    id: 1,
    name: 'React Development Fundamentals',
    department: 'Information Technology',
    duration_hours: 40,
    max_participants: 20,
    current_participants: 15,
    status: 'ongoing',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    description: 'Comprehensive React development course covering hooks, state management, and best practices',
    instructor: 'John Smith',
    completion_rate: 75,
  },
  {
    id: 2,
    name: 'Leadership Skills Workshop',
    department: 'Human Resources',
    duration_hours: 16,
    max_participants: 15,
    current_participants: 12,
    status: 'planned',
    start_date: '2024-02-01',
    end_date: '2024-02-08',
    description: 'Essential leadership skills for managers and team leads',
    instructor: 'Sarah Johnson',
    completion_rate: 0,
  },
  {
    id: 3,
    name: 'Customer Service Excellence',
    department: 'Customer Support',
    duration_hours: 24,
    max_participants: 25,
    current_participants: 25,
    status: 'completed',
    start_date: '2023-12-01',
    end_date: '2023-12-15',
    description: 'Advanced customer service techniques and communication skills',
    instructor: 'Mike Davis',
    completion_rate: 100,
  },
  {
    id: 4,
    name: 'Project Management Certification',
    department: 'Operations',
    duration_hours: 60,
    max_participants: 10,
    current_participants: 8,
    status: 'cancelled',
    start_date: '2024-01-20',
    end_date: '2024-03-20',
    description: 'PMP certification preparation course',
    instructor: 'Lisa Wilson',
    completion_rate: 0,
  },
];

// ----------------------------------------------------------------------

export default function ProgramsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Fetch programs
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await trainingService.getPrograms();
      if (response.success && Array.isArray(response.data)) {
        setPrograms(response.data);
      } else {
        setPrograms([]);
        enqueueSnackbar('No training programs found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching training programs:', error);
      setPrograms([]);
      enqueueSnackbar('Failed to load training programs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenPopover = (event, program) => {
    setOpenPopover(event.currentTarget);
    setSelectedProgram(program);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedProgram(null);
  };

  // Handle program status update
  const handleUpdateProgramStatus = async (programId, newStatus) => {
    try {
      const response = await trainingService.updateProgram(programId, { status: newStatus });
      if (response.success) {
        setPrograms(prev => 
          prev.map(program => 
            program.id === programId 
              ? { ...program, status: newStatus }
              : program
          )
        );
        enqueueSnackbar('Program status updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to update program status', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating program status:', error);
      enqueueSnackbar('Failed to update program status', { variant: 'error' });
    }
    handleClosePopover();
  };

  // Handle delete program
  const handleDeleteProgram = async (programId) => {
    try {
      const response = await trainingService.deleteProgram(programId);
      if (response.success) {
        setPrograms(prev => prev.filter(program => program.id !== programId));
        enqueueSnackbar('Program deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete program', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      enqueueSnackbar('Failed to delete program', { variant: 'error' });
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
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'info';
      case 'planned':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Information Technology':
        return 'primary';
      case 'Human Resources':
        return 'secondary';
      case 'Customer Support':
        return 'info';
      case 'Operations':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(filterName.toLowerCase()) ||
    program.department.toLowerCase().includes(filterName.toLowerCase()) ||
    program.instructor.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredPrograms.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Training Programs | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Training Programs"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Training', href: PATH_DASHBOARD.training.root },
            { name: 'Programs' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Program
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search programs..."
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
                  rowCount={filteredPrograms.length}
                />

                <TableBody>
                  {filteredPrograms
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
                              {row.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.department}
                            color={getDepartmentColor(row.department)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.duration_hours} hours
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 120 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2">
                                {row.current_participants}/{row.max_participants}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={(row.current_participants / row.max_participants) * 100}
                                sx={{ flex: 1, height: 6, borderRadius: 3 }}
                                color="primary"
                              />
                            </Stack>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.start_date).toLocaleDateString()}
                          </Typography>
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
            count={filteredPrograms.length}
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
            console.log('View program:', selectedProgram);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Edit program:', selectedProgram);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('View participants:', selectedProgram);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:people-fill" />
          View Participants
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Duplicate program:', selectedProgram);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:copy-fill" />
          Duplicate
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}