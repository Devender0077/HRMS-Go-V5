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
  TableContainer,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Stack,
  Typography,
  CircularProgress,
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
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
} from '../../components/table';
// services
import contractService from '../../services/api/contractService';
// utils
import { fDate } from '../../utils/formatTime';

// Safe date formatter that handles null/undefined/invalid dates
const safeDateFormat = (date) => {
  if (!date) return '-';
  try {
    const formatted = fDate(date);
    return formatted === 'Invalid Date' ? '-' : formatted;
  } catch (error) {
    return '-';
  }
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', align: 'left' },
  { id: 'type', label: 'Contract Type', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'duration', label: 'Duration', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function ContractsListPage() {
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

  useEffect(() => {
    fetchContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await contractService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });

      console.log('📦 Contracts response:', response);

      if (response.success && response.data) {
        const contracts = response.data.contracts || [];
        console.log('✅ Loaded contracts:', contracts);
        
        // Ensure employee names are properly displayed
        const processedContracts = contracts.map(contract => {
          // Check if employeeName looks like an ID (e.g., "HR002", "EMP001")
          const isEmployeeId = contract.employeeName && /^[A-Z]{2,4}\d{3,4}$/.test(contract.employeeName);
          
          let displayName = 'No Employee Assigned';
          let displayCode = '-';
          
          // If employee object exists, use that data
          if (contract.employee && contract.employee.first_name) {
            displayName = `${contract.employee.first_name} ${contract.employee.last_name}`.trim();
            displayCode = contract.employee.employee_id || '-';
          }
          // If employeeName is a proper name (not an ID), use it
          else if (contract.employeeName && !isEmployeeId) {
            displayName = contract.employeeName;
            displayCode = contract.employeeCode || '-';
          }
          // If employeeName is an ID, show it as the code
          else if (contract.employeeName && isEmployeeId) {
            displayName = 'No Name on Record';
            displayCode = contract.employeeName;
          }
          
          return {
            ...contract,
            employeeName: displayName,
            employeeCode: displayCode,
          };
        });

        setTableData(processedContracts);
        setTotalCount(response.data.totalCount || 0);
      } else {
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
    console.log('👁️ Viewing contract:', selectedContract.id);
    navigate(`/dashboard/contracts/${selectedContract.id}/view`);
    handleClosePopover();
  };

  const handleEdit = () => {
    console.log('✏️ Editing contract:', selectedContract.id);
    navigate(`/dashboard/contracts/${selectedContract.id}/edit`);
    handleClosePopover();
  };

  const handleDelete = async () => {
    handleClosePopover();
    if (!window.confirm('Are you sure you want to delete this contract?')) return;
    
    try {
      const response = await contractService.delete(selectedContract.id);
      if (response.success) {
        enqueueSnackbar('Contract deleted successfully', { variant: 'success' });
        fetchContracts();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete contract', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting contract', { variant: 'error' });
    }
  };

  const handleDownload = () => {
    console.log('📥 Downloading contract:', selectedContract.id);
    handleClosePopover();
    
    if (!selectedContract.id) {
      enqueueSnackbar('No contract selected', { variant: 'error' });
      return;
    }
    
    const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/contracts/${selectedContract.id}/download`;
    console.log('📥 Downloading from:', downloadUrl);
    
    // Open in new tab to trigger download
    window.open(downloadUrl, '_blank');
    enqueueSnackbar('Downloading contract document...', { variant: 'info' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring_soon': return 'warning';
      case 'expired': return 'error';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  return (
    <>
      <Helmet>
        <title> Contracts: List | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Employee Contracts"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Contracts' },
            { name: 'List' },
          ]}
          action={
            <Button 
              variant="contained" 
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => navigate('/dashboard/contracts/new')}
            >
              Add Contract
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {tableData.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                            <Stack>
                              <Typography variant="subtitle2">{row.employeeName}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employeeCode}
                              </Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={row.type} size="small" variant="outlined" />
                        </TableCell>
                          <TableCell>{safeDateFormat(row.startDate)}</TableCell>
                        <TableCell>
                            <Typography variant="body2">
                              {safeDateFormat(row.endDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{row.duration}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={row.status}
                            size="small"
                            color={getStatusColor(row.status)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                            <IconButton onClick={(event) => handleOpenPopover(event, row)}>
                              <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  {tableData.length === 0 && <TableNoData isNotFound={true} />}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 160 }}>
        <MenuItem onClick={handleView}>
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:download-fill" />
          Download
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}

