import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'program', label: 'Program', align: 'left' },
  { id: 'session', label: 'Session', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'time', label: 'Time', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'attendees', label: 'Attendees', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_SESSIONS = [
  { id: 1, program: 'React Advanced Training', session: 'Session 1: Hooks', date: '2024-12-25', time: '10:00 AM - 12:00 PM', location: 'Room A', attendees: 24, status: 'scheduled' },
  { id: 2, program: 'Leadership Development', session: 'Session 3: Team Building', date: '2024-12-20', time: '02:00 PM - 04:00 PM', location: 'Conference Hall', attendees: 15, status: 'completed' },
  { id: 3, program: 'Sales Techniques', session: 'Session 2: Closing Deals', date: '2024-12-22', time: '09:00 AM - 11:00 AM', location: 'Online', attendees: 30, status: 'in_progress' },
  { id: 4, program: 'Communication Skills', session: 'Session 1: Active Listening', date: '2025-01-05', time: '11:00 AM - 01:00 PM', location: 'Room B', attendees: 0, status: 'scheduled' },
];

// ----------------------------------------------------------------------

export default function TrainingSessionsPage() {
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
  const [tableData] = useState(MOCK_SESSIONS);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Training: Sessions | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Training Sessions"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Training' },
            { name: 'Sessions' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Schedule Session
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
                          <Typography variant="subtitle2">{row.program}</Typography>
                        </TableCell>
                        <TableCell>{row.session}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Iconify 
                              icon={row.location === 'Online' ? 'eva:monitor-outline' : 'eva:pin-outline'} 
                              width={16} 
                            />
                            <Typography variant="body2">{row.location}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" color="primary.main">
                            {row.attendees}
                          </Typography>
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
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Iconify icon="eva:close-circle-fill" />
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

