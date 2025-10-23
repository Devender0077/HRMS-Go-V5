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
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
// sections
// import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user/list';
// mock
import MenuPopover from '../../components/menu-popover';
import { PATH_DASHBOARD } from '../../routes/paths';
import { TextField, InputAdornment } from '@mui/material';

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

const MOCK_ASSETS = [
  {
    id: 1,
    asset_code: 'LAP-001',
    asset_name: 'MacBook Pro 16"',
    category: 'Laptops',
    brand: 'Apple',
    model: 'MacBook Pro 16" M2',
    current_status: 'assigned',
    condition: 'excellent',
    location: 'HQ Office - 3rd Floor',
  },
  {
    id: 2,
    asset_code: 'LAP-002',
    asset_name: 'Dell XPS 15',
    category: 'Laptops',
    brand: 'Dell',
    model: 'XPS 15 9530',
    current_status: 'assigned',
    condition: 'good',
    location: 'HQ Office - 2nd Floor',
  },
  {
    id: 3,
    asset_code: 'LAP-003',
    asset_name: 'Lenovo ThinkPad X1',
    category: 'Laptops',
    brand: 'Lenovo',
    model: 'ThinkPad X1 Carbon Gen 11',
    current_status: 'available',
    condition: 'excellent',
    location: 'IT Storage Room',
  },
  {
    id: 4,
    asset_code: 'DKT-001',
    asset_name: 'iMac 24"',
    category: 'Desktops',
    brand: 'Apple',
    model: 'iMac 24" M1',
    current_status: 'assigned',
    condition: 'excellent',
    location: 'Design Studio',
  },
  {
    id: 5,
    asset_code: 'MOB-001',
    asset_name: 'iPhone 14 Pro',
    category: 'Mobile Devices',
    brand: 'Apple',
    model: 'iPhone 14 Pro',
    current_status: 'assigned',
    condition: 'excellent',
    location: 'HQ Office',
  },
];

// ----------------------------------------------------------------------

export default function AssetsListPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('asset_code');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleOpenPopover = (event, asset) => {
    setOpenPopover(event.currentTarget);
    setSelectedAsset(asset);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedAsset(null);
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
      case 'available':
        return 'success';
      case 'assigned':
        return 'info';
      case 'under_maintenance':
        return 'warning';
      case 'retired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAssets = assets.filter((asset) =>
    asset.asset_name.toLowerCase().includes(filterName.toLowerCase()) ||
    asset.asset_code.toLowerCase().includes(filterName.toLowerCase())
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
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredAssets.length}
                />

                <TableBody>
                  {filteredAssets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>{row.asset_code}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{row.asset_name}</Typography>
                        </TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>
                          {row.brand}
                          {row.model && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {row.model}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.current_status.replace('_', ' ')}
                            color={getStatusColor(row.current_status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.condition}
                            color={getConditionColor(row.condition)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{row.location}</TableCell>
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
            count={filteredAssets.length}
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
            navigate(PATH_DASHBOARD.assets.view(selectedAsset?.id));
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate(PATH_DASHBOARD.assets.edit(selectedAsset?.id));
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            // Handle assign
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:person-add-fill" />
          Assign
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
