import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
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
import Label from '../../components/label';
// services
import documentService from '../../services/api/documentService';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'document', label: 'Document', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'uploadDate', label: 'Upload Date', align: 'left' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function EmployeeDocumentsPage() {
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
  
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await documentService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: filters.search || undefined,
          category: filters.category || undefined,
          status: filters.status || undefined,
        };

        const response = await documentService.getAllEmployeeDocuments(params);
        
        setDocuments(response.documents || []);
        setTotalRecords(response.pagination?.total || 0);
      } catch (err) {
        console.error('Fetch documents error:', err);
        setError(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [page, rowsPerPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    onChangePage(null, 0); // Reset to first page when filter changes
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'expiring_soon': return 'warning';
      case 'expired': return 'error';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'expiring_soon': return 'Expiring Soon';
      case 'expired': return 'Expired';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysDiff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 30;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const handleVerify = async (id, status) => {
    try {
      await documentService.verifyDocument(id, { 
        status, 
        verificationNotes: `${status} by admin` 
      });
      
      // Refresh documents list
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      const response = await documentService.getAllEmployeeDocuments(params);
      setDocuments(response.documents || []);
    } catch (err) {
      console.error('Verify document error:', err);
      alert('Failed to verify document');
    }
  };

  return (
    <>
      <Helmet>
        <title> Documents: Employee Documents | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Documents"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Documents' },
            { name: 'Employee Documents' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:cloud-upload-fill" />}>
              Upload Document
            </Button>
          }
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          {/* Filters */}
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Search employee or document..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1 }} />,
              }}
            />
            <TextField
              select
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Stack>

          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <>
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
                      {documents.map((row) => {
                        const expired = isExpired(row.expiry_date);
                        const expiringSoon = !expired && isExpiringSoon(row.expiry_date);
                        const displayStatus = expired ? 'expired' : expiringSoon ? 'expiring_soon' : row.status;

                        return (
                          <TableRow key={row.id} hover>
                            <TableCell>
                              <Stack>
                                <Typography variant="subtitle2">{row.employee_name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {row.employee_id}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{row.document_name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={row.category_name} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              {row.expiry_date ? (
                                <Typography 
                                  variant="body2" 
                                  color={expired || expiringSoon ? 'error.main' : 'text.primary'}
                                >
                                  {fDate(row.expiry_date)}
                                </Typography>
                              ) : (
                                <Typography variant="body2" color="text.disabled">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Label
                                color={getStatusColor(displayStatus)}
                                sx={{ textTransform: 'capitalize' }}
                              >
                                {getStatusLabel(displayStatus)}
                              </Label>
                            </TableCell>
                            <TableCell>{fDate(row.upload_date)}</TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <Iconify icon="eva:eye-fill" />
                              </IconButton>
                              <IconButton size="small">
                                <Iconify icon="eva:download-fill" />
                              </IconButton>
                              {row.status === 'pending' && (
                                <>
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleVerify(row.id, 'verified')}
                                  >
                                    <Iconify icon="eva:checkmark-circle-fill" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleVerify(row.id, 'rejected')}
                                  >
                                    <Iconify icon="eva:close-circle-fill" />
                                  </IconButton>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {documents.length === 0 && <TableNoData isNotFound={true} />}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePaginationCustom
                count={totalRecords}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            </>
          )}
        </Card>
      </Container>
    </>
  );
}
