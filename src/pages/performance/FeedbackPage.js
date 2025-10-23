import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Typography,
  Avatar,
  AvatarGroup,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';
import performanceService from '../../services/performanceService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'reviewers', label: 'Reviewers', align: 'left' },
  { id: 'feedbackType', label: 'Type', align: 'left' },
  { id: 'requestDate', label: 'Requested On', align: 'left' },
  { id: 'dueDate', label: 'Due Date', align: 'left' },
  { id: 'responses', label: 'Responses', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_FEEDBACK = [
  { id: 1, employee: 'John Doe', reviewers: ['Manager', 'Peer 1', 'Peer 2', 'Direct Report'], feedbackType: '360 Feedback', requestDate: '2024-12-01', dueDate: '2024-12-15', responses: 3, total: 4, status: 'in_progress' },
  { id: 2, employee: 'Jane Smith', reviewers: ['Manager', 'Peer 1', 'Peer 2'], feedbackType: 'Peer Review', requestDate: '2024-11-20', dueDate: '2024-12-05', responses: 3, total: 3, status: 'completed' },
  { id: 3, employee: 'Bob Johnson', reviewers: ['Manager', 'Client'], feedbackType: 'Client Feedback', requestDate: '2024-12-10', dueDate: '2024-12-24', responses: 0, total: 2, status: 'pending' },
];

// ----------------------------------------------------------------------

export default function FeedbackPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await performanceService.getFeedback();
      if (response.success && Array.isArray(response.data)) {
        setTableData(response.data);
      } else {
        setTableData([]);
        enqueueSnackbar('No feedback found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setTableData([]);
      enqueueSnackbar('Failed to load feedback', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Performance: 360° Feedback | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="360° Feedback"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Performance' },
            { name: '360° Feedback' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Request Feedback
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />
                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{row.employee}</Typography>
                        </TableCell>
                        <TableCell>
                          <AvatarGroup max={4}>
                            {row.reviewers.map((reviewer, index) => (
                              <Avatar key={index} alt={reviewer} sx={{ width: 32, height: 32 }}>
                                {reviewer.charAt(0)}
                              </Avatar>
                            ))}
                          </AvatarGroup>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.feedbackType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{row.requestDate}</TableCell>
                        <TableCell>{row.dueDate}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                            <Typography variant="subtitle2" color="primary.main">
                              {row.responses}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              / {row.total}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <Iconify icon="eva:eye-fill" />
                          </IconButton>
                          <IconButton size="small">
                            <Iconify icon="eva:email-fill" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {tableData.length === 0 && <TableNoData isNotFound={true} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={tableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

