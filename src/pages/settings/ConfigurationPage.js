import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import {
  Container,
  Card,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import { useSnackbar } from '../../components/snackbar';
// services
import configurationService from '../../services/api/configurationService';
import departmentService from '../../services/departmentService';
import branchService from '../../services/branchService';
import designationService from '../../services/designationService';
import leaveService from '../../services/api/leaveService';
import documentService from '../../services/api/documentService';

// ----------------------------------------------------------------------

const CONFIG_TABS = [
  // Organization (already exist in backend via other routes)
  { value: 'branches', label: 'Branches', service: 'branch', method: 'getAll' },
  { value: 'departments', label: 'Departments', service: 'department', method: 'getAll' },
  { value: 'designations', label: 'Designations', service: 'designation', method: 'getAll' },
  
  // Attendance (in configuration controller)
  { value: 'shifts', label: 'Shifts', service: 'configuration', method: 'getShifts' },
  { value: 'policies', label: 'Attendance Policies', service: 'configuration', method: 'getAttendancePolicies' },
  
  // Leave  
  { value: 'leaveTypes', label: 'Leave Types', service: 'leave', method: 'getLeaveTypes' },
  { value: 'leavePolicies', label: 'Leave Policies', service: 'configuration', method: 'getLeavePolicies' },
  
  // Payroll (in configuration controller)
  { value: 'salary', label: 'Salary Components', service: 'configuration', method: 'getSalaryComponents' },
  { value: 'tax', label: 'Tax Settings', service: 'configuration', method: 'getTaxSettings' },
  { value: 'payment', label: 'Payment Methods', service: 'configuration', method: 'getPaymentMethods' },
  
  // Recruitment (need to add to backend)
  { value: 'jobCategories', label: 'Job Categories', service: 'configuration', method: 'getJobCategories' },
  { value: 'jobTypes', label: 'Job Types', service: 'configuration', method: 'getJobTypes' },
  { value: 'hiringStages', label: 'Hiring Stages', service: 'configuration', method: 'getHiringStages' },
  
  // Performance
  { value: 'kpiIndicators', label: 'KPI Indicators', service: 'configuration', method: 'getKPIIndicators' },
  { value: 'reviewCycles', label: 'Review Cycles', service: 'configuration', method: 'getReviewCycles' },
  { value: 'goalCategories', label: 'Goal Categories', service: 'configuration', method: 'getGoalCategories' },
  
  // Training
  { value: 'trainingTypes', label: 'Training Types', service: 'configuration', method: 'getTrainingTypes' },
  
  // Documents
  { value: 'documentCategories', label: 'Document Categories', service: 'document', method: 'getCategories' },
  { value: 'documentTypes', label: 'Document Types', service: 'configuration', method: 'getDocumentTypes' },
  { value: 'companyPolicies', label: 'Company Policies', service: 'configuration', method: 'getCompanyPolicies' },
  
  // Awards
  { value: 'awardTypes', label: 'Award Types', service: 'configuration', method: 'getAwardTypes' },
  
  // Termination
  { value: 'terminationTypes', label: 'Termination Types', service: 'configuration', method: 'getTerminationTypes' },
  { value: 'terminationReasons', label: 'Termination Reasons', service: 'configuration', method: 'getTerminationReasons' },
  
  // Expense
  { value: 'expenseCategories', label: 'Expense Categories', service: 'configuration', method: 'getExpenseCategories' },
  { value: 'expenseLimits', label: 'Expense Limits', service: 'configuration', method: 'getExpenseLimits' },
  
  // Income
  { value: 'incomeCategories', label: 'Income Categories', service: 'configuration', method: 'getIncomeCategories' },
  { value: 'incomeSources', label: 'Income Sources', service: 'configuration', method: 'getIncomeSources' },
  
  // Contract
  { value: 'contractTypes', label: 'Contract Types', service: 'configuration', method: 'getContractTypes' },
  
  // Messenger
  { value: 'messageTemplates', label: 'Message Templates', service: 'configuration', method: 'getMessageTemplates' },
  { value: 'notificationSettings', label: 'Notification Settings', service: 'configuration', method: 'getNotificationSettings' },
];

export default function ConfigurationPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  
  // Get initial tab from location state or default to 'shifts'
  const initialTab = location.state?.tab || 'shifts';
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (location.state?.tab) {
      setCurrentTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();
  }, [currentTab]);

  const fetchData = async () => {
    setLoading(true);
    setData([]);
    
    try {
      const tabConfig = CONFIG_TABS.find(t => t.value === currentTab);
      if (!tabConfig) {
        setData([]);
        return;
      }

      let result = [];
      
      // Route to appropriate service
      switch (tabConfig.service) {
        case 'branch':
          const branchRes = await branchService.getAll();
          console.log('Branches response:', branchRes);
          result = branchRes.data?.branches || branchRes.branches || branchRes.data || branchRes || [];
          break;
        case 'department':
          const deptRes = await departmentService.getAll();
          console.log('Departments response:', deptRes);
          result = deptRes.data?.departments || deptRes.departments || deptRes.data || deptRes || [];
          break;
        case 'designation':
          const designRes = await designationService.getAll();
          console.log('Designations response:', designRes);
          result = designRes.data?.designations || designRes.designations || designRes.data || designRes || [];
          break;
        case 'leave':
          const leaveRes = await leaveService.getLeaveTypes();
          console.log('Leave types response:', leaveRes);
          // Handle both response formats
          if (Array.isArray(leaveRes)) {
            result = leaveRes;
          } else if (leaveRes.types) {
            result = leaveRes.types;
          } else if (leaveRes.data) {
            result = leaveRes.data;
          } else {
            result = [];
          }
          break;
        case 'document':
          if (tabConfig.method === 'getCategories') {
            result = await documentService.getCategories();
          }
          break;
        case 'configuration':
          // Call the appropriate configuration service method
          if (configurationService[tabConfig.method]) {
            try {
              const configRes = await configurationService[tabConfig.method]({ status: 'active' });
              console.log(`${tabConfig.method} response:`, configRes);
              
              // All configuration APIs now return { data: [...], total: X }
              if (Array.isArray(configRes)) {
                result = configRes;
              } else if (configRes.data) {
                result = Array.isArray(configRes.data) ? configRes.data : [configRes.data];
              } else {
                // Fallback for any legacy format
                result = [];
                console.warn(`Unexpected response format for ${tabConfig.method}:`, configRes);
              }
              
              console.log(`Loaded ${result.length} items for ${currentTab}`);
            } catch (err) {
              console.error(`Error calling ${tabConfig.method}:`, err);
              enqueueSnackbar(`Failed to load ${currentTab}: ${err.message}`, { variant: 'error' });
              result = [];
            }
          }
          break;
        default:
          result = [];
      }

      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar(`Failed to load ${currentTab}`, { variant: 'error' });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({});
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setOpenDialog(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name || item.title}"?`)) return;

    try {
      const tabConfig = CONFIG_TABS.find(t => t.value === currentTab);
      if (!tabConfig) {
        enqueueSnackbar('Configuration not found', { variant: 'error' });
        return;
      }

      console.log('Deleting item:', item.id);

      // Route to appropriate service for delete
      switch (tabConfig.service) {
        case 'branch':
          await branchService.deleteBranch(item.id);
          break;

        case 'department':
          await departmentService.deleteDepartment(item.id);
          break;

        case 'designation':
          await designationService.deleteDesignation(item.id);
          break;

        case 'configuration':
          // Handle different configuration types
          if (tabConfig.value === 'shifts') {
            await configurationService.deleteShift(item.id);
          } else if (tabConfig.value === 'policies') {
            await configurationService.deleteAttendancePolicy(item.id);
          } else if (tabConfig.value === 'salary') {
            await configurationService.deleteSalaryComponent(item.id);
          } else if (tabConfig.value === 'payment') {
            await configurationService.deletePaymentMethod(item.id);
          } else if (tabConfig.value === 'tax') {
            await configurationService.deleteTaxSetting(item.id);
          } else {
            enqueueSnackbar('Delete not yet implemented for this configuration type', { variant: 'info' });
            return;
          }
          break;

        default:
          enqueueSnackbar('Delete not yet implemented for this type', { variant: 'info' });
          return;
      }

      enqueueSnackbar('Item deleted successfully', { variant: 'success' });
      // Refresh data after delete
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete item', { variant: 'error' });
    }
  };

  const handleSave = async () => {
    try {
      const tabConfig = CONFIG_TABS.find(t => t.value === currentTab);
      if (!tabConfig) {
        enqueueSnackbar('Configuration not found', { variant: 'error' });
        return;
      }

      let response;
      const isUpdate = selectedItem && selectedItem.id;

      console.log('Saving item:', { currentTab, isUpdate, formData, selectedItem });

      // Route to appropriate service for create/update
      switch (tabConfig.service) {
        case 'branch':
          if (isUpdate) {
            response = await branchService.updateBranch(selectedItem.id, formData);
          } else {
            response = await branchService.createBranch(formData);
          }
          break;

        case 'department':
          if (isUpdate) {
            response = await departmentService.updateDepartment(selectedItem.id, formData);
          } else {
            response = await departmentService.createDepartment(formData);
          }
          break;

        case 'designation':
          if (isUpdate) {
            response = await designationService.updateDesignation(selectedItem.id, formData);
          } else {
            response = await designationService.createDesignation(formData);
          }
          break;

        case 'configuration':
          // Handle different configuration types
          if (tabConfig.value === 'shifts') {
            if (isUpdate) {
              response = await configurationService.updateShift(selectedItem.id, formData);
            } else {
              response = await configurationService.createShift(formData);
            }
          } else if (tabConfig.value === 'policies') {
            if (isUpdate) {
              response = await configurationService.updateAttendancePolicy(selectedItem.id, formData);
            } else {
              response = await configurationService.createAttendancePolicy(formData);
            }
          } else if (tabConfig.value === 'salary') {
            if (isUpdate) {
              response = await configurationService.updateSalaryComponent(selectedItem.id, formData);
            } else {
              response = await configurationService.createSalaryComponent(formData);
            }
          } else if (tabConfig.value === 'payment') {
            if (isUpdate) {
              response = await configurationService.updatePaymentMethod(selectedItem.id, formData);
            } else {
              response = await configurationService.createPaymentMethod(formData);
            }
          } else if (tabConfig.value === 'tax') {
            if (isUpdate) {
              response = await configurationService.updateTaxSetting(selectedItem.id, formData);
            } else {
              response = await configurationService.createTaxSetting(formData);
            }
          } else {
            enqueueSnackbar('Save not yet implemented for this configuration type', { variant: 'info' });
            setOpenDialog(false);
            return;
          }
          break;

        default:
          enqueueSnackbar('Save not yet implemented for this type', { variant: 'info' });
          setOpenDialog(false);
          return;
      }

      console.log('Save response:', response);
      enqueueSnackbar(isUpdate ? 'Item updated successfully' : 'Item created successfully', { variant: 'success' });
      setOpenDialog(false);
      
      // Refresh data to show the updated/new item
      await fetchData();
    } catch (error) {
      console.error('Save error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to save item', { variant: 'error' });
    }
  };

  const currentTabConfig = CONFIG_TABS.find(t => t.value === currentTab);

  return (
    <>
      <Helmet>
        <title> Configuration | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="System Configuration"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Settings' },
            { name: 'Configuration' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                onClick={() => window.history.back()}
              >
                Back to Setup
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleAdd}
              >
                Add New
              </Button>
            </Stack>
          }
        />

        <Card>
          {/* Tabs - Scrollable for many tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.neutral' }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              {CONFIG_TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  sx={{ minWidth: 120 }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {currentTabConfig?.label || 'Configuration'}
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
              </Box>
            ) : data.length > 0 ? (
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Code/Details</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{row.name || row.title}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {row.code || row.description || row.email || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Label color={row.status === 'active' ? 'success' : 'default'}>
                              {row.status || 'active'}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleEdit(row)}>
                              <Iconify icon="eva:edit-fill" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                              <Iconify icon="eva:trash-2-fill" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Iconify icon="eva:inbox-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {currentTabConfig?.label} Configured
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                  Start by adding your first {currentTabConfig?.label.toLowerCase()}
                </Typography>
                <Button variant="contained" onClick={handleAdd} startIcon={<Iconify icon="eva:plus-fill" />}>
                  Add {currentTabConfig?.label}
                </Button>
              </Box>
            )}
          </Box>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedItem ? `Edit ${currentTabConfig?.label}` : `Add New ${currentTabConfig?.label}`}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Code/ID"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status || 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

