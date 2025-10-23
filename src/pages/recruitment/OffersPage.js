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
  Stack,
  Chip,
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
import recruitmentService from '../../services/recruitmentService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'candidate', label: 'Candidate', align: 'left' },
  { id: 'position', label: 'Position', align: 'left' },
  { id: 'salary', label: 'Offered Salary', align: 'right' },
  { id: 'sentDate', label: 'Sent Date', align: 'left' },
  { id: 'validUntil', label: 'Valid Until', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const MOCK_OFFERS = [
  { id: 1, name: 'Lisa Anderson', job: 'HR Manager', salary: 75000, sentDate: '2024-12-15', validUntil: '2024-12-22', status: 'pending' },
  { id: 2, name: 'Sarah Wilson', job: 'Marketing Lead', salary: 85000, sentDate: '2024-12-10', validUntil: '2024-12-17', status: 'accepted' },
  { id: 3, name: 'David Chen', job: 'Software Engineer', salary: 95000, sentDate: '2024-12-05', validUntil: '2024-12-12', status: 'rejected' },
];

// ----------------------------------------------------------------------

export default function OffersPage() {
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

  // Fetch offers data
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      if (response.success && Array.isArray(response.data)) {
        // Filter applications that have offers
        const offersData = response.data.filter(app => 
          app.status === 'offer_sent' || app.status === 'offer_accepted' || 
          app.status === 'offer_rejected' || app.status === 'hired'
        );
        setTableData(offersData);
      } else {
        setTableData([]);
        enqueueSnackbar('No offers found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setTableData([]);
      enqueueSnackbar('Failed to load offers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Recruitment: Offers | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Offer Management"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Recruitment' },
            { name: 'Offers' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Create Offer
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
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </TableCell>
                        <TableCell>{row.job}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="primary.main">
                            ${row.salary.toLocaleString()}/year
                          </Typography>
                        </TableCell>
                        <TableCell>{row.sentDate}</TableCell>
                        <TableCell>{row.validUntil}</TableCell>
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
                            <Iconify icon="eva:download-fill" />
                          </IconButton>
                          <IconButton size="small" color="info">
                            <Iconify icon="eva:email-fill" />
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

