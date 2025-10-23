import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  Rating,
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
import performanceService from '../../services/performanceService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'reviewer', label: 'Reviewer', alignRight: false },
  { id: 'period', label: 'Review Period', alignRight: false },
  { id: 'rating', label: 'Rating', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'due_date', label: 'Due Date', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    employee: {
      name: 'John Doe',
      avatar: '/assets/images/avatars/avatar_1.jpg',
      employee_id: 'EMP001',
    },
    reviewer: {
      name: 'Jane Smith',
      avatar: '/assets/images/avatars/avatar_2.jpg',
    },
    period: 'Q4 2023',
    rating: 4.2,
    status: 'completed',
    due_date: '2024-01-31',
    completed_date: '2024-01-25',
    goals_achieved: 'Exceeded sales targets by 15%',
    areas_for_improvement: 'Time management skills',
  },
  {
    id: 2,
    employee: {
      name: 'Mike Johnson',
      avatar: '/assets/images/avatars/avatar_3.jpg',
      employee_id: 'EMP003',
    },
    reviewer: {
      name: 'Alice Brown',
      avatar: '/assets/images/avatars/avatar_4.jpg',
    },
    period: 'Q4 2023',
    rating: 3.8,
    status: 'in_progress',
    due_date: '2024-02-15',
    completed_date: null,
    goals_achieved: null,
    areas_for_improvement: null,
  },
  {
    id: 3,
    employee: {
      name: 'Sarah Wilson',
      avatar: '/assets/images/avatars/avatar_5.jpg',
      employee_id: 'EMP005',
    },
    reviewer: {
      name: 'Bob Davis',
      avatar: '/assets/images/avatars/avatar_6.jpg',
    },
    period: 'Q4 2023',
    rating: 4.5,
    status: 'pending',
    due_date: '2024-02-28',
    completed_date: null,
    goals_achieved: null,
    areas_for_improvement: null,
  },
  {
    id: 4,
    employee: {
      name: 'Tom Anderson',
      avatar: '/assets/images/avatars/avatar_7.jpg',
      employee_id: 'EMP007',
    },
    reviewer: {
      name: 'Lisa Garcia',
      avatar: '/assets/images/avatars/avatar_8.jpg',
    },
    period: 'Q4 2023',
    rating: 3.2,
    status: 'overdue',
    due_date: '2024-01-15',
    completed_date: null,
    goals_achieved: null,
    areas_for_improvement: null,
  },
];

// ----------------------------------------------------------------------

export default function ReviewsPage() {
  const { themeStretch } = useSettingsContext();

  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleOpenPopover = (event, review) => {
    setOpenPopover(event.currentTarget);
    setSelectedReview(review);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedReview(null);
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
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'info';
    if (rating >= 2.5) return 'warning';
    return 'error';
  };

  const filteredReviews = reviews.filter((review) =>
    review.employee.name.toLowerCase().includes(filterName.toLowerCase()) ||
    review.reviewer.name.toLowerCase().includes(filterName.toLowerCase()) ||
    review.period.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredReviews.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Performance Reviews | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Performance Reviews"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Performance', href: PATH_DASHBOARD.performance.root },
            { name: 'Reviews' },
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
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Review
              </Button>
            </Stack>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search reviews..."
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
                  rowCount={filteredReviews.length}
                />

                <TableBody>
                  {filteredReviews
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
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
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar src={row.reviewer.avatar} />
                            <Typography variant="body2">
                              {row.reviewer.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {row.period}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Rating
                              value={row.rating}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {row.rating}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status.replace('_', ' ')}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={row.status === 'overdue' ? 'error.main' : 'text.secondary'}
                          >
                            {new Date(row.due_date).toLocaleDateString()}
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
            count={filteredReviews.length}
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
            console.log('View review:', selectedReview);
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>

        {selectedReview?.status !== 'completed' && (
          <MenuItem
            onClick={() => {
              console.log('Edit review:', selectedReview);
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:edit-fill" />
            Edit Review
          </MenuItem>
        )}

        {selectedReview?.status === 'pending' && (
          <MenuItem
            onClick={() => {
              console.log('Start review:', selectedReview);
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:play-fill" />
            Start Review
          </MenuItem>
        )}

        {selectedReview?.status === 'in_progress' && (
          <MenuItem
            onClick={() => {
              console.log('Complete review:', selectedReview);
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:checkmark-circle-2-fill" />
            Complete Review
          </MenuItem>
        )}

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}