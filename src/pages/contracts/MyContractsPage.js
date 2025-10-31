import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Container,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Stack,
  Typography,
  Chip,
  Box,
  Alert,
  IconButton,
  MenuItem,
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
import {
  useTable,
  TableNoData,
  TableHeadCustom,
} from '../../components/table';
// services
import contractInstanceService from '../../services/api/contractInstanceService';
// utils
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contract_number', label: 'Agreement #', align: 'left' },
  { id: 'template_name', label: 'Document Type', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'sent_date', label: 'Received Date', align: 'left' },
  { id: 'expires_at', label: 'Expires', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const STATUS_COLORS = {
  draft: 'default',
  sent: 'warning',
  pending: 'warning',
  viewed: 'info',
  completed: 'success',
  cancelled: 'error',
  expired: 'error',
  declined: 'error',
};

// ----------------------------------------------------------------------

export default function MyContractsPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    fetchMyContracts();
  }, [page, rowsPerPage]);

  const fetchMyContracts = async () => {
    try {
      setLoading(true);
      const response = await contractInstanceService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });
      
      if (response.success) {
        setContracts(response.data || []);
        setTotalCount(response.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      enqueueSnackbar('Failed to fetch contracts', { variant: 'error' });
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, contract) => {
    setOpenPopover(event.currentTarget);
    setSelectedContract(contract);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleSign = () => {
    navigate(`/dashboard/contracts/sign/${selectedContract.id}`);
    handleClosePopover();
  };

  const handleView = () => {
    navigate(`/dashboard/contracts/sign/${selectedContract.id}`);
    handleClosePopover();
  };

  const handleDecline = async () => {
    handleClosePopover();
    
    const reason = window.prompt('Please provide a reason for declining:');
    if (!reason) return;
    
    try {
      const response = await contractInstanceService.decline(selectedContract.id, reason);
      if (response.success) {
        enqueueSnackbar('Contract declined', { variant: 'success' });
        fetchMyContracts();
      }
    } catch (error) {
      enqueueSnackbar('Failed to decline contract', { variant: 'error' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return fDate(dateString);
  };

  const getPendingCount = () => contracts.filter(c => c.status === 'sent' || c.status === 'pending').length;

  return (
    <>
      <Helmet>
        <title>My Contracts | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="My Contracts"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'My Contracts' },
          ]}
          sx={{ mb: 5 }}
        />

        {getPendingCount() > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }} icon={<Iconify icon="eva:alert-circle-fill" />}>
            <Typography variant="subtitle2">
              You have {getPendingCount()} pending contract(s) waiting for your signature
            </Typography>
            <Typography variant="body2">
              Please review and sign them before they expire.
            </Typography>
          </Alert>
        )}

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="medium">
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <Typography variant="body2" color="text.secondary">
                          Loading contracts...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : contracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <Box>
                          <Iconify icon="eva:file-text-outline" width={64} sx={{ mb: 2, color: 'text.disabled' }} />
                          <Typography variant="h6" paragraph>
                            No Contracts Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            You don't have any contracts sent for signature yet.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    contracts.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {row.contract_number || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{row.template_name || row.title || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status?.toUpperCase() || 'PENDING'}
                            size="small"
                            color={STATUS_COLORS[row.status] || 'default'}
                            variant="soft"
                          />
                        </TableCell>
                        <TableCell>{formatDate(row.sent_date)}</TableCell>
                        <TableCell>
                          {row.expires_at ? (
                            <Typography variant="body2" color={new Date(row.expires_at) < new Date() ? 'error.main' : 'text.primary'}>
                              {formatDate(row.expires_at)}
                            </Typography>
                          ) : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {row.status === 'completed' ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Iconify icon="eva:eye-outline" />}
                              onClick={() => navigate(`/dashboard/contracts/sign/${row.id}`)}
                            >
                              View
                            </Button>
                          ) : row.status === 'sent' || row.status === 'pending' || row.status === 'viewed' ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              startIcon={<Iconify icon="eva:edit-outline" />}
                              onClick={() => navigate(`/dashboard/contracts/sign/${row.id}`)}
                            >
                              Sign Now
                            </Button>
                          ) : (
                            <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

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
            <Iconify icon="eva:eye-outline" />
            View Contract
          </MenuItem>
          
          {selectedContract?.status !== 'completed' && selectedContract?.status !== 'cancelled' && (
            <MenuItem onClick={handleDecline} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:close-circle-outline" />
              Decline
            </MenuItem>
          )}
        </MenuPopover>
      </Container>
    </>
  );
}

