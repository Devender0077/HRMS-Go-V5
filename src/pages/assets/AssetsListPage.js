import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import { useSnackbar } from '../../components/snackbar';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import assetService from '../../services/api/assetService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'asset_code', label: 'Asset Code', alignRight: false },
  { id: 'asset_name', label: 'Asset Name', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: 'brand', label: 'Brand/Model', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'condition', label: 'Condition', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function AssetsListPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState('');
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await assetService.getAll();
      console.log('✅ Assets loaded:', data);
      setAssets(data || []);
    } catch (error) {
      console.error('❌ Error fetching assets:', error);
      enqueueSnackbar('Failed to fetch assets', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event, asset) => {
    setOpenPopover(event.currentTarget);
    setSelectedAsset(asset);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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

  const handleView = (id) => {
    navigate(PATH_DASHBOARD.assets.view(id));
    handleClosePopover();
  };

  const handleEdit = (id) => {
    navigate(PATH_DASHBOARD.assets.edit(id));
    handleClosePopover();
  };

  const handleDeleteClick = (asset) => {
    setSelectedAsset(asset);
    setOpenConfirm(true);
    handleClosePopover();
  };

  const handleConfirmDelete = async () => {
    try {
      await assetService.delete(selectedAsset.id);
      enqueueSnackbar('Asset deleted successfully!', { variant: 'success' });
      fetchAssets();
      setOpenConfirm(false);
    } catch (error) {
      console.error('Error deleting asset:', error);
      enqueueSnackbar('Failed to delete asset', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'success',
      assigned: 'info',
      maintenance: 'warning',
      retired: 'error',
    };
    return colors[status] || 'default';
  };

  const getConditionColor = (condition) => {
    const colors = {
      excellent: 'success',
      good: 'info',
      fair: 'warning',
      poor: 'error',
    };
    return colors[condition] || 'default';
  };

  const filteredAssets = assets.filter((asset) =>
    (asset.asset_name?.toLowerCase() || '').includes(filterName.toLowerCase()) ||
    (asset.asset_code?.toLowerCase() || '').includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredAssets.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Assets List | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Assets List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.assets.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Asset
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search assets..."
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
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {filteredAssets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((asset) => (
                      <TableRow key={asset.id} hover>
                        <TableCell>{asset.asset_code || '-'}</TableCell>
                        <TableCell>{asset.asset_name || '-'}</TableCell>
                        <TableCell>{asset.category_name || '-'}</TableCell>
                        <TableCell>
                          {asset.brand} {asset.model ? `- ${asset.model}` : ''}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={asset.status || 'available'}
                            color={getStatusColor(asset.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={asset.condition || 'good'}
                            color={getConditionColor(asset.condition)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{asset.location || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, asset)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  {!loading && filteredAssets.length === 0 && (
                    <TableNoData isNotFound={isNotFound || filteredAssets.length === 0} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAssets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
        <MenuItem onClick={() => handleView(selectedAsset?.id)}>
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedAsset?.id)}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteClick(selectedAsset)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete Asset"
        content={`Are you sure you want to delete "${selectedAsset?.asset_name}"?`}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
