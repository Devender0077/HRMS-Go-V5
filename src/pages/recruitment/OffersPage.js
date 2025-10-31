import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
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
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsOffer, setDetailsOffer] = useState(null);

  // Fetch offers data
  const fetchOffers = useCallback(async () => {
    try {
      // Prefer a dedicated offers endpoint if available
      const res = await recruitmentService.getOffers();
      let payload = [];
      if (res && res.success && Array.isArray(res.data)) payload = res.data;
      else if (Array.isArray(res)) payload = res;

      if (!payload.length) {
        // Fallback: derive offers from applications
        const appsRes = await recruitmentService.getJobApplications();
        if (appsRes && appsRes.success && Array.isArray(appsRes.data)) {
          payload = appsRes.data.filter((app) => {
            const s = (app.status || '').toString().toLowerCase();
            return s === 'offer' || s === 'offer_sent' || s === 'offer_accepted' || s === 'offer_rejected' || s === 'hired' || s === 'offered';
          }).map((a) => ({
            id: a.id || a._id,
            name: a.candidate_name || a.name || a.applicant_name || a.email || 'Unknown',
            job: (a.job && (a.job.title || a.job.name)) || a.job_title || '',
            salary: a.offered_salary || a.salary || a.offer_salary || null,
            sentDate: a.offer_sent_date || a.sent_date || a.updated_at || a.created_at || null,
            validUntil: a.offer_valid_until || a.valid_until || null,
            status: a.status || 'offer',
          }));
        }
      }

      if (Array.isArray(payload) && payload.length) {
        // Normalize payload to expected table rows
        const normalized = payload.map((it) => ({
          id: it.id || it._id,
          name: it.name || it.candidate || it.candidate_name || it.email || 'Unknown',
          job: it.job?.title || it.job?.name || it.job || it.job_title || '',
          salary: it.salary ?? it.offered_salary ?? it.offer_salary ?? null,
          sentDate: it.sentDate || it.sent_date || it.offer_sent_date || it.updated_at || it.created_at || null,
          validUntil: it.validUntil || it.valid_until || it.offer_valid_until || null,
          status: (it.status || '').toString(),
        }));

        setTableData(normalized);
      } else {
        setTableData([]);
        enqueueSnackbar('No offers found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      setTableData([]);
      enqueueSnackbar('Failed to load offers', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleOpenDetails = (row) => {
    setDetailsOffer(row);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setDetailsOffer(null);
  };

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
                            {row.salary != null ? `$${Number(row.salary).toLocaleString()}/year` : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.sentDate ? (isNaN(new Date(row.sentDate).getTime()) ? row.sentDate : new Date(row.sentDate).toLocaleDateString()) : '-'}</TableCell>
                        <TableCell>{row.validUntil ? (isNaN(new Date(row.validUntil).getTime()) ? row.validUntil : new Date(row.validUntil).toLocaleDateString()) : '-'}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleOpenDetails(row)}>
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

      {/* Offer Details dialog */}
      <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth="sm">
        <DialogTitle>Offer Details</DialogTitle>
        <DialogContent dividers>
          {detailsOffer ? (
            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography variant="subtitle1">{detailsOffer.name}</Typography>
              <Typography variant="body2" color="text.secondary">{detailsOffer.job}</Typography>
              <Typography variant="body2">Salary: {detailsOffer.salary != null ? `$${Number(detailsOffer.salary).toLocaleString()}/year` : '-'}</Typography>
              <Typography variant="body2">Sent: {detailsOffer.sentDate ? (isNaN(new Date(detailsOffer.sentDate).getTime()) ? detailsOffer.sentDate : new Date(detailsOffer.sentDate).toLocaleString()) : '-'}</Typography>
              <Typography variant="body2">Valid Until: {detailsOffer.validUntil ? (isNaN(new Date(detailsOffer.validUntil).getTime()) ? detailsOffer.validUntil : new Date(detailsOffer.validUntil).toLocaleDateString()) : '-'}</Typography>
              <Box>
                <Chip label={detailsOffer.status} size="small" color={getStatusColor(detailsOffer.status)} sx={{ textTransform: 'capitalize' }} />
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
    </>
  );
}

