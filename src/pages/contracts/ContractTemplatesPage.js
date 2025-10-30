import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  Chip,
  Stack,
  Typography,
  MenuItem,
  TextField,
  InputAdornment,
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
  TableSelectedAction,
  TableRow,
  TableCell,
} from '../../components/table';
// services
import contractTemplateService from '../../services/api/contractTemplateService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Template Name', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'region', label: 'Region', align: 'center' },
  { id: 'fields', label: 'Fields', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'employee', label: 'Employee Documents' },
  { value: 'vendor', label: 'Vendor Contracts' },
  { value: 'msa', label: 'Master Service Agreement' },
  { value: 'po', label: 'Purchase Order' },
  { value: 'sow', label: 'Statement of Work' },
  { value: 'nda', label: 'NDA' },
  { value: 'other', label: 'Other' },
];

const REGION_OPTIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'usa', label: '🇺🇸 USA' },
  { value: 'india', label: '🇮🇳 India' },
  { value: 'global', label: '🌍 Global' },
];

// ----------------------------------------------------------------------

export default function ContractTemplatesPage() {
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
  } = useTable();

  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, categoryFilter, regionFilter]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await contractTemplateService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        category: categoryFilter,
        region: regionFilter,
      });

      if (response.success) {
        setTableData(response.data || []);
        setTotalCount(response.totalCount || 0);
      } else {
        enqueueSnackbar(response.message || 'Failed to load templates', { variant: 'error' });
        setTableData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      enqueueSnackbar('Error loading templates', { variant: 'error' });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      fetchTemplates();
    }
  };

  const handleOpenPopover = (event, template) => {
    setSelectedTemplate(template);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleEdit = () => {
    navigate(`/dashboard/contracts/templates/${selectedTemplate.id}/edit`);
    handleClosePopover();
  };

  const handleUse = () => {
    navigate(`/dashboard/contracts/send?templateId=${selectedTemplate.id}`);
    handleClosePopover();
  };

  const handleDuplicate = async () => {
    handleClosePopover();
    try {
      const response = await contractTemplateService.duplicate(selectedTemplate.id);
      if (response.success) {
        enqueueSnackbar('Template duplicated successfully', { variant: 'success' });
        fetchTemplates();
      } else {
        enqueueSnackbar(response.message || 'Failed to duplicate template', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error duplicating template', { variant: 'error' });
    }
  };

  const handleToggleActive = async () => {
    handleClosePopover();
    try {
      const response = await contractTemplateService.toggleActive(selectedTemplate.id);
      if (response.success) {
        enqueueSnackbar(response.message || 'Status updated successfully', { variant: 'success' });
        fetchTemplates();
      } else {
        enqueueSnackbar(response.message || 'Failed to update status', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleDelete = () => {
    handleClosePopover();
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await contractTemplateService.delete(selectedTemplate.id);
      if (response.success) {
        enqueueSnackbar('Template deleted successfully', { variant: 'success' });
        setOpenConfirm(false);
        fetchTemplates();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete template', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting template', { variant: 'error' });
    }
  };

  const getCategoryLabel = (category) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category);
    return option?.label || category;
  };

  const getRegionFlag = (region) => {
    if (region === 'usa') return '🇺🇸';
    if (region === 'india') return '🇮🇳';
    return '🌍';
  };

  return (
    <>
      <Helmet>
        <title> Contract Templates | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Contract Templates"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: '/dashboard/contracts' },
            { name: 'Templates' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/dashboard/contracts/templates/new')}
            >
              New Template
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
              onKeyPress={handleSearch}
              placeholder="Search templates..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              SelectProps={{ native: false }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              sx={{ maxWidth: { md: 180 } }}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              SelectProps={{ native: false }}
            >
              {REGION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {!loading && tableData.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Iconify
                            icon={
                              row.fileType?.includes('pdf')
                                ? 'vscode-icons:file-type-pdf2'
                                : 'vscode-icons:file-type-word'
                            }
                            sx={{ width: 32, height: 32 }}
                          />
                          <div>
                            <Typography variant="subtitle2">{row.name}</Typography>
                            {row.description && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {row.description}
                              </Typography>
                            )}
                          </div>
                        </Stack>
                      </TableCell>

                      <TableCell>{getCategoryLabel(row.category)}</TableCell>

                      <TableCell align="center">
                        <Chip
                          label={`${getRegionFlag(row.region)} ${row.region.toUpperCase()}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={row.fields?.length || 0}
                          size="small"
                          color="info"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={row.isActive ? 'Active' : 'Inactive'}
                          color={row.isActive ? 'success' : 'default'}
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
          <MenuItem onClick={handleUse}>
            <Iconify icon="eva:paper-plane-fill" />
            Use Template
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <Iconify icon="eva:edit-fill" />
            Edit Fields
          </MenuItem>

          <MenuItem onClick={handleDuplicate}>
            <Iconify icon="eva:copy-fill" />
            Duplicate
          </MenuItem>

          <MenuItem onClick={handleToggleActive}>
            <Iconify icon={selectedTemplate?.isActive ? 'eva:eye-off-fill' : 'eva:eye-fill'} />
            {selectedTemplate?.isActive ? 'Deactivate' : 'Activate'}
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </MenuPopover>

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          title="Delete Template"
          content={`Are you sure you want to delete "${selectedTemplate?.name}"? This action cannot be undone.`}
          action={
            <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          }
        />
      </Container>
    </>
  );
}

