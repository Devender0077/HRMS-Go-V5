import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
// services
import leaveService from '../../services/api/leaveService';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import { TableHeadCustom } from '../../components/table';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'leaveType', label: 'Leave Type', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'days', label: 'Days Per Year', align: 'center' },
  { id: 'carryForward', label: 'Carry Forward', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function LeaveBalanceAllocationPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 [Leave Allocation] Loading ALL leave types (both active and inactive)...');
      
      // Load ALL leave types (both active and inactive)
      const typesResponse = await leaveService.getLeaveTypes();
      console.log('📥 [Leave Allocation] Leave types response:', typesResponse);
      
      if (typesResponse.success && typesResponse.types) {
        // Remove duplicates based on ID (just in case)
        const uniqueTypes = typesResponse.types.filter((type, index, self) =>
          index === self.findIndex((t) => t.id === type.id)
        );
        
        // Sort: active first, then inactive
        const sortedTypes = uniqueTypes.sort((a, b) => {
          if (a.status === 'active' && b.status !== 'active') return -1;
          if (a.status !== 'active' && b.status === 'active') return 1;
          return a.name.localeCompare(b.name);
        });
        
        setLeaveTypes(sortedTypes);
        console.log(`✅ [Leave Allocation] Loaded ${sortedTypes.length} leave types (active + inactive)`);
        console.log('📋 [Leave Allocation] Leave types:', sortedTypes.map(t => ({ 
          id: t.id, 
          name: t.name, 
          status: t.status,
          days: t.days_per_year || t.daysPerYear || 0 
        })));
      } else {
        console.error('❌ [Leave Allocation] Failed to load leave types:', typesResponse);
        setLeaveTypes([]);
      }
    } catch (error) {
      console.error('❌ [Leave Allocation] Error loading:', error);
      enqueueSnackbar('Error loading leave types', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (leaveType) => {
    console.log('📝 [Leave Allocation] Editing leave type:', leaveType.name);
    setIsCreateMode(false);
    setSelectedLeaveType(leaveType);
    setEditForm({
      days_per_year: leaveType.days_per_year || leaveType.daysPerYear || 0,
      carry_forward: leaveType.carry_forward || false,
      max_carry_forward: leaveType.max_carry_forward || 0,
    });
    setOpenDialog(true);
  };

  const handleOpenCreateDialog = () => {
    console.log('➕ [Leave Allocation] Creating new leave type');
    setIsCreateMode(true);
    setSelectedLeaveType(null);
    setEditForm({
      name: '',
      description: '',
      days_per_year: 0,
      carry_forward: false,
      max_carry_forward: 0,
      type: 'paid',
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLeaveType(null);
    setEditForm({});
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveLeaveType = async () => {
    try {
      if (isCreateMode) {
        // Validate required fields for create
        if (!editForm.name || !editForm.name.trim()) {
          enqueueSnackbar('Leave type name is required', { variant: 'error' });
          return;
        }

        console.log('➕ [Leave Allocation] Creating new leave type:', editForm.name);
        console.log('💾 [Leave Allocation] Data:', editForm);
        
        // Call backend API to create new leave type
        const response = await leaveService.createLeaveType(editForm);
        
        if (response.success) {
          enqueueSnackbar(
            `✅ New leave type "${editForm.name}" created - All employees will have ${editForm.days_per_year} days/year`, 
            { variant: 'success' }
          );
          handleCloseDialog();
          loadData(); // Reload to show new type
        } else {
          enqueueSnackbar(response.message || 'Error creating leave type', { variant: 'error' });
        }
      } else {
        // Update existing leave type
        console.log('🔄 [Leave Allocation] Updating leave type:', selectedLeaveType.name);
        console.log('💾 [Leave Allocation] New values:', editForm);
        
        // Call backend API to update leave type defaults
        const response = await leaveService.updateLeaveType(selectedLeaveType.id, editForm);
        
        if (response.success) {
          enqueueSnackbar(
            `✅ Default updated for "${selectedLeaveType.name}" - All employees will now have ${editForm.days_per_year} days/year`, 
            { variant: 'success' }
          );
          handleCloseDialog();
          loadData(); // Reload to show updated values
        } else {
          enqueueSnackbar(response.message || 'Error updating leave type', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('❌ [Leave Allocation] Error saving:', error);
      enqueueSnackbar(isCreateMode ? 'Error creating leave type' : 'Error updating leave type', { variant: 'error' });
    }
  };

  const handleToggleStatus = async (leaveType) => {
    try {
      const newStatus = leaveType.status === 'active' ? 'inactive' : 'active';
      console.log(`🔄 [Leave Allocation] ${newStatus === 'active' ? 'Activating' : 'Deactivating'} leave type:`, leaveType.name);
      
      const response = await leaveService.updateLeaveType(leaveType.id, { status: newStatus });
      
      console.log('📥 [Leave Allocation] Update response:', response);
      
      if (response.success) {
        enqueueSnackbar(
          `✅ "${leaveType.name}" ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 
          { variant: 'success' }
        );
        
        // Update local state immediately for instant UI feedback
        setLeaveTypes(prevTypes => 
          prevTypes.map(type => 
            type.id === leaveType.id 
              ? { ...type, status: newStatus }
              : type
          )
        );
        
        // Reload from server to ensure consistency
        await loadData();
      } else {
        enqueueSnackbar(response.message || 'Error updating status', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ [Leave Allocation] Error toggling status:', error);
      enqueueSnackbar('Error updating leave type status', { variant: 'error' });
    }
  };

  const handleDeleteLeaveType = async (leaveType) => {
    if (!window.confirm(`Are you sure you want to delete "${leaveType.name}"?\n\nThis will remove this leave type for ALL employees. This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ [Leave Allocation] Deleting leave type:', leaveType.name);
      
      const response = await leaveService.deleteLeaveType(leaveType.id);
      
      if (response.success) {
        enqueueSnackbar(
          `✅ "${leaveType.name}" deleted successfully - Removed from all employees`, 
          { variant: 'success' }
        );
        loadData();
      } else {
        enqueueSnackbar(response.message || 'Error deleting leave type', { variant: 'error' });
      }
    } catch (error) {
      console.error('❌ [Leave Allocation] Error deleting:', error);
      enqueueSnackbar('Error deleting leave type', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Leave Balance Allocation | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Leave Balance Allocation"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'System Setup', href: PATH_DASHBOARD.settings.systemSetup },
            { name: 'Leave Balance Allocation' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                sx={{ minWidth: 150 }}
                size="small"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i + 1).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleOpenCreateDialog}
              >
                New Leave Type
              </Button>
            </Stack>
          }
        />

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Organization-Wide Leave Defaults:</strong> Set default leave balances for year {selectedYear}.
            These defaults will automatically apply to ALL employees in the organization and will be used when they apply for leaves.
          </Typography>
        </Alert>

        <Card>
          {loading ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Scrollbar>
                <Table>
                  <TableHeadCustom headLabel={TABLE_HEAD} />
                  <TableBody>
                    {leaveTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 10 }}>
                          <Iconify icon="eva:inbox-outline" sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No leave types configured
                          </Typography>
                          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                            Configure leave types in system settings first
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaveTypes.map((leaveType) => (
                        <TableRow key={leaveType.id} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Iconify
                                icon={
                                  leaveType.name.toLowerCase().includes('annual') ? 'eva:calendar-outline' :
                                  leaveType.name.toLowerCase().includes('sick') ? 'eva:thermometer-outline' :
                                  leaveType.name.toLowerCase().includes('casual') ? 'eva:sun-outline' :
                                  leaveType.name.toLowerCase().includes('maternity') ? 'eva:heart-outline' :
                                  leaveType.name.toLowerCase().includes('paternity') ? 'eva:people-outline' :
                                  'eva:briefcase-outline'
                                }
                                sx={{ fontSize: 40, color: 'primary.main' }}
                              />
                              <Box>
                                <Typography variant="subtitle2">
                                  {leaveType.name}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                  Type: {leaveType.type || 'Paid'}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {leaveType.description || 'Default leave type for all employees'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip 
                              label={`${leaveType.days_per_year || leaveType.daysPerYear || 0} days`} 
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip 
                              label={leaveType.carry_forward ? 'Yes' : 'No'}
                              color={leaveType.carry_forward ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip 
                              label={leaveType.status === 'active' ? 'Active' : 'Inactive'}
                              color={leaveType.status === 'active' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {/* Edit Button */}
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                startIcon={<Iconify icon="eva:edit-fill" />}
                                onClick={() => handleOpenDialog(leaveType)}
                              >
                                Edit
                              </Button>

                              {/* Activate/Deactivate Button */}
                              <Button
                                size="small"
                                variant="outlined"
                                color={leaveType.status === 'active' ? 'warning' : 'success'}
                                startIcon={<Iconify icon={leaveType.status === 'active' ? 'eva:stop-circle-outline' : 'eva:play-circle-outline'} />}
                                onClick={() => handleToggleStatus(leaveType)}
                              >
                                {leaveType.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>

                              {/* Delete Button */}
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Iconify icon="eva:trash-2-outline" />}
                                onClick={() => handleDeleteLeaveType(leaveType)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}
        </Card>
      </Container>

      {/* Create/Edit Leave Type Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isCreateMode ? 'Create New Leave Type' : `Edit Organization Default - ${selectedLeaveType?.name}`}
        </DialogTitle>
        
        <DialogContent>
          <Alert severity={isCreateMode ? 'info' : 'warning'} sx={{ mb: 3, mt: 2 }}>
            <Typography variant="caption">
              {isCreateMode ? (
                <>
                  <strong>New Leave Type:</strong> This will create a new leave type that will be available to <strong>ALL employees</strong> in the organization.
                </>
              ) : (
                <>
                  <strong>Important:</strong> Changing this value will set the default leave balance for <strong>ALL employees</strong> in the organization for year {selectedYear}.
                  Existing employee balances will NOT be affected, only new allocations.
                </>
              )}
            </Typography>
          </Alert>

          <Stack spacing={3}>
            {isCreateMode && (
              <>
                <TextField
                  fullWidth
                  required
                  label="Leave Type Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="e.g., Work From Home, Study Leave"
                  helperText="Unique name for this leave type"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  value={editForm.description || ''}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief description of this leave type"
                  helperText="Optional description"
                />

                <TextField
                  fullWidth
                  select
                  label="Leave Type"
                  value={editForm.type || 'paid'}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  helperText="Whether this leave is paid or unpaid"
                >
                  <MenuItem value="paid">Paid Leave</MenuItem>
                  <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                </TextField>
              </>
            )}

            <TextField
              fullWidth
              type="number"
              label="Days Per Year"
              value={editForm.days_per_year || 0}
              onChange={(e) => handleFormChange('days_per_year', Number(e.target.value))}
              InputProps={{
                endAdornment: <Typography variant="caption" sx={{ ml: 1 }}>days</Typography>,
              }}
              helperText={`This is the default annual allocation for all employees`}
              inputProps={{
                min: 0,
                max: 365,
              }}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ minWidth: 150 }}>
                Allow Carry Forward?
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Yes"
                  color={editForm.carry_forward ? 'primary' : 'default'}
                  onClick={() => handleFormChange('carry_forward', true)}
                  clickable
                />
                <Chip
                  label="No"
                  color={!editForm.carry_forward ? 'primary' : 'default'}
                  onClick={() => handleFormChange('carry_forward', false)}
                  clickable
                />
              </Stack>
            </Stack>

            {editForm.carry_forward && (
              <TextField
                fullWidth
                type="number"
                label="Max Carry Forward Days"
                value={editForm.max_carry_forward || 0}
                onChange={(e) => handleFormChange('max_carry_forward', Number(e.target.value))}
                InputProps={{
                  endAdornment: <Typography variant="caption" sx={{ ml: 1 }}>days</Typography>,
                }}
                helperText={`Maximum days that can be carried forward to next year`}
                inputProps={{
                  min: 0,
                  max: editForm.days_per_year || 365,
                }}
              />
            )}
          </Stack>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.darker">
              📊 Summary:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isCreateMode ? (
                <>
                  All employees will have <strong>{editForm.days_per_year || 0} {editForm.name || '[New Leave Type]'} days</strong> per year.
                  {editForm.carry_forward && ` Up to ${editForm.max_carry_forward || 0} days can be carried forward.`}
                </>
              ) : (
                <>
                  All employees will have <strong>{editForm.days_per_year || 0} {selectedLeaveType?.name} days</strong> per year.
                  {editForm.carry_forward && ` Up to ${editForm.max_carry_forward || 0} days can be carried forward.`}
                </>
              )}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLeaveType}>
            {isCreateMode ? 'Create Leave Type' : 'Update Default'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

