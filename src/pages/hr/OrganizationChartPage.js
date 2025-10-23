import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Card,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
import Iconify from '../../components/iconify';
// services
import organizationService from '../../services/api/organizationService';

// ----------------------------------------------------------------------

function EmployeeNode({ employee, level = 0 }) {
  const hasChildren = employee.children && employee.children.length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      {/* Employee Card */}
      <Card
        sx={{
          p: 3,
          minWidth: 280,
          textAlign: 'center',
          position: 'relative',
          '&:hover': {
            boxShadow: (theme) => theme.customShadows.z24,
          },
        }}
      >
        <Avatar
          alt={employee.name}
          src={employee.avatar}
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
          }}
        />
        
        <Typography variant="h6" gutterBottom>
          {employee.name}
        </Typography>
        
        <Typography variant="body2" color="primary.main" gutterBottom>
          {employee.position}
        </Typography>
        
        <Chip
          label={employee.department}
          size="small"
          sx={{ mt: 1 }}
          color="default"
          variant="outlined"
        />

        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          {employee.email}
        </Typography>

        {employee.employee_id && (
          <Chip
            label={employee.employee_id}
            size="small"
            sx={{ mt: 1 }}
            variant="filled"
          />
        )}

        {hasChildren && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }} color="primary.main">
            {employee.children.length} Direct Report{employee.children.length > 1 ? 's' : ''}
          </Typography>
        )}
      </Card>

      {/* Vertical Connector */}
      {hasChildren && (
        <Box
          sx={{
            width: 2,
            height: 40,
            bgcolor: 'divider',
            my: 1,
          }}
        />
      )}

      {/* Children */}
      {hasChildren && (
        <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
          {/* Horizontal Connector */}
          {employee.children.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: `calc(100% - 140px)`,
                height: 2,
                bgcolor: 'divider',
              }}
            />
          )}

          {employee.children.map((child, index) => (
            <Box key={child.id} sx={{ position: 'relative' }}>
              {/* Vertical connector to horizontal line */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 20,
                  bgcolor: 'divider',
                }}
              />
              <Box sx={{ mt: 2.5 }}>
                <EmployeeNode employee={child} level={level + 1} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function OrganizationChartPage() {
  const { themeStretch } = useSettingsContext();
  const [viewMode, setViewMode] = useState('chart');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [chartResponse, statsResponse] = await Promise.all([
        organizationService.getOrganizationChart(),
        organizationService.getOrganizationStats(),
      ]);

      console.log('Organization Chart Data:', chartResponse);
      setOrgData(chartResponse.organization);
      setStats(statsResponse.stats);
    } catch (err) {
      console.error('Error fetching organization data:', err);
      setError('Failed to load organization chart. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <>
      <Helmet>
        <title>Organization Chart | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Organization Chart"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Human Resources', href: PATH_DASHBOARD.hr.root },
            { name: 'Organization Chart' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                size="small"
              >
                <ToggleButton value="chart">
                  <Iconify icon="eva:diagram-outline" sx={{ mr: 1 }} />
                  Chart View
                </ToggleButton>
                <ToggleButton value="list">
                  <Iconify icon="eva:list-outline" sx={{ mr: 1 }} />
                  List View
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:download-outline" />}
              >
                Export
              </Button>
            </Stack>
          }
        />

        {/* Stats Cards */}
        {stats && (
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Card sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">{stats.totalEmployees}</Typography>
              <Typography variant="caption" color="text.secondary">Total Employees</Typography>
            </Card>
            <Card sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{stats.totalDepartments}</Typography>
              <Typography variant="caption" color="text.secondary">Departments</Typography>
            </Card>
            <Card sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">{stats.totalBranches}</Typography>
              <Typography variant="caption" color="text.secondary">Branches</Typography>
            </Card>
          </Stack>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : viewMode === 'chart' ? (
          <Box
            sx={{
              p: 4,
              bgcolor: 'background.neutral',
              borderRadius: 2,
              overflow: 'auto',
              minHeight: 600,
            }}
          >
            {orgData ? (
              <EmployeeNode employee={orgData} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="body2" color="text.secondary">
                  No organization structure found. Please add employees with manager relationships.
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hierarchical List View
            </Typography>
            <Typography variant="body2" color="text.secondary">
              List view coming soon...
            </Typography>
          </Card>
        )}
      </Container>
    </>
  );
}
