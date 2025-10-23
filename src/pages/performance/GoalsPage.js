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
import performanceService from '../../services/performanceService';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'goal', label: 'Goal', alignRight: false },
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'target_date', label: 'Target Date', alignRight: false },
  { id: 'progress', label: 'Progress', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_GOALS = [
  {
    id: 1,
    goal: 'Increase sales by 20% this quarter',
    employee: {
      name: 'John Doe',
      avatar: '/assets/images/avatars/avatar_1.jpg',
      employee_id: 'EMP001',
    },
    category: 'Sales',
    target_date: '2024-03-31',
    progress: 65,
    status: 'in_progress',
    description: 'Focus on new client acquisition and upselling existing clients',
    created_at: '2024-01-01',
  },
  {
    id: 2,
    goal: 'Complete React certification',
    employee: {
      name: 'Jane Smith',
      avatar: '/assets/images/avatars/avatar_2.jpg',
      employee_id: 'EMP002',
    },
    category: 'Learning',
    target_date: '2024-02-28',
    progress: 100,
    status: 'completed',
    description: 'Complete the React Developer certification course',
    created_at: '2024-01-15',
  },
  {
    id: 3,
    goal: 'Reduce customer support response time',
    employee: {
      name: 'Mike Johnson',
      avatar: '/assets/images/avatars/avatar_3.jpg',
      employee_id: 'EMP003',
    },
    category: 'Customer Service',
    target_date: '2024-04-30',
    progress: 30,
    status: 'in_progress',
    description: 'Implement new ticketing system and train team',
    created_at: '2024-01-10',
  },
  {
    id: 4,
    goal: 'Launch new product feature',
    employee: {
      name: 'Alice Brown',
      avatar: '/assets/images/avatars/avatar_4.jpg',
      employee_id: 'EMP004',
    },
    category: 'Product',
    target_date: '2024-05-15',
    progress: 0,
    status: 'not_started',
    description: 'Design and develop new dashboard feature',
    created_at: '2024-01-20',
  },
];

// ----------------------------------------------------------------------

export default function GoalsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Fetch goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await performanceService.getGoals();
      if (response.success && Array.isArray(response.data)) {
        setGoals(response.data);
      } else {
        setGoals([]);
        enqueueSnackbar('No goals found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoals([]);
      enqueueSnackbar('Failed to load goals', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenPopover = (event, goal) => {
    setOpenPopover(event.currentTarget);
    setSelectedGoal(goal);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedGoal(null);
  };

  // Handle goal status update
  const handleUpdateGoalStatus = async (goalId, newStatus) => {
    try {
      const response = await performanceService.updateGoal(goalId, { status: newStatus });
      if (response.success) {
        setGoals(prev => 
          prev.map(goal => 
            goal.id === goalId 
              ? { ...goal, status: newStatus }
              : goal
          )
        );
        enqueueSnackbar('Goal status updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to update goal status', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating goal status:', error);
      enqueueSnackbar('Failed to update goal status', { variant: 'error' });
    }
    handleClosePopover();
  };

  // Handle delete goal
  const handleDeleteGoal = async (goalId) => {
    try {
      const response = await performanceService.deleteGoal(goalId);
      if (response.success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        enqueueSnackbar('Goal deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete goal', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      enqueueSnackbar('Failed to delete goal', { variant: 'error' });
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
      case 'in_progress':
        return 'info';
      case 'not_started':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sales':
        return 'primary';
      case 'Learning':
        return 'secondary';
      case 'Customer Service':
        return 'info';
      case 'Product':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredGoals = goals.filter((goal) =>
    goal.goal.toLowerCase().includes(filterName.toLowerCase()) ||
    goal.employee.name.toLowerCase().includes(filterName.toLowerCase()) ||
    goal.category.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredGoals.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Performance Goals | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Performance Goals"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Performance', href: PATH_DASHBOARD.performance.root },
            { name: 'Goals' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Goal
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search goals..."
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
                  rowCount={filteredGoals.length}
                />

                <TableBody>
                  {filteredGoals
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
                              {row.goal}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar src={row.employee.avatar} />
                            <Box>
                              <Typography variant="subtitle2" noWrap>
                                {row.employee.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employee.employee_id}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.category}
                            color={getCategoryColor(row.category)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.target_date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 100 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LinearProgress
                                variant="determinate"
                                value={row.progress}
                                sx={{ flex: 1, height: 8, borderRadius: 4 }}
                                color={row.progress === 100 ? 'success' : 'primary'}
                              />
                              <Typography variant="caption" sx={{ minWidth: 35 }}>
                                {row.progress}%
                              </Typography>
                            </Stack>
                          </Box>
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
            count={filteredGoals.length}
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
            console.log('View goal:', selectedGoal);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Edit goal:', selectedGoal);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Update progress:', selectedGoal);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:trending-up-fill" />
          Update Progress
        </MenuItem>

        <MenuItem
          onClick={() => {
            console.log('Mark complete:', selectedGoal);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:checkmark-circle-2-fill" />
          Mark Complete
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}