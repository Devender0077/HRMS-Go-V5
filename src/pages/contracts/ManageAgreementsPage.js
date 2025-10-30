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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Divider,
  Checkbox,
  Tooltip,
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
  TableSelectedAction,
} from '../../components/table';
// services
import contractInstanceService from '../../services/api/contractInstanceService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contract_number', label: 'Agreement #', align: 'left' },
  { id: 'template_name', label: 'Template', align: 'left' },
  { id: 'recipient', label: 'Recipient', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'sent_date', label: 'Sent Date', align: 'left' },
  { id: 'completed_date', label: 'Completed', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const STATUS_FILTERS = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'draft', label: 'Drafts', count: 0 },
  { value: 'sent', label: 'In Progress', count: 0 },
  { value: 'pending', label: 'Waiting for You', count: 0 },
  { value: 'completed', label: 'Completed', count: 0 },
  { value: 'cancelled', label: 'Canceled', count: 0 },
  { value: 'expired', label: 'Expired', count: 0 },
];

const STATUS_COLORS = {
  draft: 'default',
  sent: 'info',
  pending: 'warning',
  viewed: 'primary',
  completed: 'success',
  cancelled: 'error',
  expired: 'error',
};

// ----------------------------------------------------------------------

export default function ManageAgreementsPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterCounts, setFilterCounts] = useState(STATUS_FILTERS);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  useEffect(() => {
    fetchAgreements();
  }, [selectedFilter]);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const response = await contractInstanceService.getAll();
      
      // Extract data array from response (handles both { data: [...] } and [...] formats)
      const data = Array.isArray(response) ? response : (response.data || []);
      
      let filtered = data;
      if (selectedFilter !== 'all') {
        filtered = data.filter(item => item.status === selectedFilter);
      }
      
      // Calculate counts
      const counts = STATUS_FILTERS.map(filter => ({
        ...filter,
        count: filter.value === 'all' ? data.length : data.filter(d => d.status === filter.value).length,
      }));
      
      setFilterCounts(counts);
      setAgreements(filtered);
    } catch (error) {
      console.error('Error fetching agreements:', error);
      enqueueSnackbar('Failed to fetch agreements', { variant: 'error' });
      // Set empty data on error
      setAgreements([]);
      setFilterCounts(STATUS_FILTERS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, agreement) => {
    setOpenPopover(event.currentTarget);
    setSelectedAgreement(agreement);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleView = () => {
    navigate(`/dashboard/contracts/sign/${selectedAgreement.id}`);
    handleClosePopover();
  };

  const handleSend = async () => {
    handleClosePopover();
    try {
      await contractInstanceService.send(selectedAgreement.id);
      enqueueSnackbar('Agreement sent successfully!', { variant: 'success' });
      fetchAgreements();
    } catch (error) {
      enqueueSnackbar('Failed to send agreement', { variant: 'error' });
    }
  };

  const handleCancel = async () => {
    handleClosePopover();
    try {
      await contractInstanceService.cancel(selectedAgreement.id);
      enqueueSnackbar('Agreement canceled', { variant: 'success' });
      fetchAgreements();
    } catch (error) {
      enqueueSnackbar('Failed to cancel agreement', { variant: 'error' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Agreements | Contract Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Manage Agreements"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'Manage Agreements' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/dashboard/contracts/send')}
            >
              Send for E-Signature
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {/* LEFT SIDEBAR - Agreement Filters */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                AGREEMENTS
              </Typography>
              
              <List disablePadding>
                {filterCounts.map((filter) => (
                  <ListItem key={filter.value} disablePadding>
                    <ListItemButton
                      selected={selectedFilter === filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                          '&:hover': {
                            bgcolor: 'action.selected',
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary={filter.label}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: { fontWeight: selectedFilter === filter.value ? 600 : 400 },
                        }}
                      />
                      {filter.count > 0 && (
                        <Chip 
                          label={filter.count} 
                          size="small" 
                          color={selectedFilter === filter.value ? 'primary' : 'default'}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Quick Actions
              </Typography>
              
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Iconify icon="eva:file-text-outline" />}
                  onClick={() => navigate('/dashboard/contracts/templates')}
                >
                  View Templates
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Iconify icon="eva:email-outline" />}
                  onClick={() => navigate('/dashboard/contracts/send')}
                >
                  Send Contract
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT - Agreements Table */}
          <Grid item xs={12} md={9}>
            <Card>
              <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <TableSelectedAction
                  dense={false}
                  numSelected={selected.length}
                  rowCount={agreements.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      agreements.map((row) => row.id)
                    )
                  }
                  action={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Send Selected">
                        <IconButton color="primary">
                          <Iconify icon="eva:email-outline" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel Selected">
                        <IconButton color="error">
                          <Iconify icon="eva:close-circle-outline" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
                
                <Scrollbar>
                  <Table size="medium">
                    <TableHeadCustom
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={agreements.length}
                      numSelected={selected.length}
                      onSort={onSort}
                      onSelectAllRows={(checked) =>
                        onSelectAllRows(
                          checked,
                          agreements.map((row) => row.id)
                        )
                      }
                    />

                    <TableBody>
                      {agreements
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const isSelected = selected.includes(row.id);
                          
                          return (
                            <TableRow key={row.id} hover selected={isSelected}>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => onSelectRow(row.id)}
                                />
                              </TableCell>
                              <TableCell>{row.contract_number || '-'}</TableCell>
                              <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                  {row.template_name || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Stack>
                                  <Typography variant="body2">{row.recipient_email || '-'}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.employee_name || ''}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.status}
                                  size="small"
                                  color={STATUS_COLORS[row.status] || 'default'}
                                  variant="soft"
                                />
                              </TableCell>
                              <TableCell>{formatDate(row.sent_date)}</TableCell>
                              <TableCell>{formatDate(row.completed_date)}</TableCell>
                              <TableCell align="right">
                                <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                                  <Iconify icon="eva:more-vertical-fill" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>

                    {!loading && agreements.length === 0 && (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {selectedFilter === 'all' 
                                ? 'No agreements found. Send your first e-signature request!'
                                : `No ${selectedFilter} agreements`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={agreements.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Actions Menu */}
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 200 }}
        >
          <MenuItem onClick={handleView}>
            <Iconify icon="eva:eye-fill" />
            View Agreement
          </MenuItem>

          {selectedAgreement?.status === 'draft' && (
            <MenuItem onClick={handleSend}>
              <Iconify icon="eva:paper-plane-fill" />
              Send for Signature
            </MenuItem>
          )}

          {['draft', 'sent', 'pending'].includes(selectedAgreement?.status) && (
            <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:close-circle-fill" />
              Cancel Agreement
            </MenuItem>
          )}

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={() => console.log('Download')}>
            <Iconify icon="eva:download-fill" />
            Download PDF
          </MenuItem>

          <MenuItem onClick={() => console.log('Audit trail')}>
            <Iconify icon="eva:file-text-fill" />
            View Audit Trail
          </MenuItem>
        </MenuPopover>
      </Container>
    </>
  );
}

