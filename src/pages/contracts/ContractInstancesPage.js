import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Chip,
  Stack,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  LinearProgress,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
} from '../../components/table';
// services
import contractInstanceService from '../../services/api/contractInstanceService';
// utils
import { fDate, fDateTime } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contractNumber', label: 'Contract #', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'recipient', label: 'Recipient', align: 'left' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'sentDate', label: 'Sent Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

// ----------------------------------------------------------------------

export default function ContractInstancesPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, statusFilter]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await contractInstanceService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        status: statusFilter,
      });

      if (response.success) {
        setTableData(response.data || []);
        setTotalCount(response.totalCount || 0);
      } else {
        enqueueSnackbar(response.message || 'Failed to load contracts', { variant: 'error' });
        setTableData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching contracts:', error);
      enqueueSnackbar('Error loading contracts', { variant: 'error' });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, contract) => {
    setSelectedContract(contract);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleView = () => {
    navigate(`/dashboard/contracts/instances/${selectedContract.id}/view`);
    handleClosePopover();
  };

  const handleSend = async () => {
    handleClosePopover();
    try {
      const response = await contractInstanceService.send(selectedContract.id);
      if (response.success) {
        enqueueSnackbar('Contract sent successfully', { variant: 'success' });
        fetchContracts();
      } else {
        enqueueSnackbar(response.message || 'Failed to send contract', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error sending contract', { variant: 'error' });
    }
  };

  const handleCancel = async () => {
    handleClosePopover();
    setOpenConfirm(true);
  };

  const handleCancelConfirm = async () => {
    try {
      const response = await contractInstanceService.cancel(selectedContract.id);
      if (response.success) {
        enqueueSnackbar('Contract cancelled successfully', { variant: 'success' });
        setOpenConfirm(false);
        fetchContracts();
      } else {
        enqueueSnackbar(response.message || 'Failed to cancel contract', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error cancelling contract', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      draft: 'default',
      sent: 'info',
      viewed: 'warning',
      in_progress: 'warning',
      completed: 'success',
      declined: 'error',
      expired: 'error',
      cancelled: 'default',
    };
    return statusColors[status] || 'default';
  };

  return (
    <>
      <Helmet>
        <title> Digital Contracts | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Digital Contracts"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: 'Digital Contracts' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:paper-plane-fill" />}
              onClick={() => navigate('/dashboard/contracts/send')}
            >
              Send Contract
            </Button>
          }
        />

        <Card>
          <Stack
            spacing={2}
            alignItems="center"
            direction={{ xs: 'column', md: 'row' }}
            sx={{ px: 2.5, py: 3 }}
          >
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchContracts()}
              placeholder="Search contracts..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              sx={{ maxWidth: { md: 200 } }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ native: false }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {loading && <LinearProgress />}

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
                  {!loading && tableData.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{row.contractNumber}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{row.title}</Typography>
                        {row.template && (
                          <Typography variant="caption" color="text.secondary">
                            Template: {row.template.name}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <div>
                          <Typography variant="subtitle2">{row.recipientName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.recipientEmail}
                          </Typography>
                        </div>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={row.recipientType}
                          size="small"
                          variant="outlined"
                          color={row.recipientType === 'employee' ? 'primary' : 'secondary'}
                        />
                      </TableCell>

                      <TableCell>
                        {row.sentDate ? fDate(row.sentDate) : '-'}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={row.status}
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

                  <TableNoData isNotFound={!loading && tableData.length === 0} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>

        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 200 }}
        >
          <MenuItem onClick={handleView}>
            <Iconify icon="eva:eye-fill" />
            View Details
          </MenuItem>

          {selectedContract?.status === 'draft' && (
            <MenuItem onClick={handleSend}>
              <Iconify icon="eva:paper-plane-fill" />
              Send Now
            </MenuItem>
          )}

          {['draft', 'sent', 'viewed'].includes(selectedContract?.status) && (
            <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:close-circle-fill" />
              Cancel
            </MenuItem>
          )}
        </MenuPopover>

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          title="Cancel Contract"
          content={`Are you sure you want to cancel contract "${selectedContract?.contractNumber}"?`}
          action={
            <Button variant="contained" color="error" onClick={handleCancelConfirm}>
              Cancel Contract
            </Button>
          }
        />
      </Container>
    </>
  );
}

