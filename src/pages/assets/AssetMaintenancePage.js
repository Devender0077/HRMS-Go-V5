import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  IconButton,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import { useSnackbar } from '../../components/snackbar';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import assetMaintenanceService from '../../services/api/assetMaintenanceService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'asset', label: 'Asset', alignRight: false },
  { id: 'maintenance_type', label: 'Type', alignRight: false },
  { id: 'scheduled_date', label: 'Scheduled Date', alignRight: false },
  { id: 'completed_date', label: 'Completed Date', alignRight: false },
  { id: 'cost', label: 'Cost', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function AssetMaintenancePage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await assetMaintenanceService.getAll();
      setMaintenances(data || []);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      enqueueSnackbar('Failed to fetch maintenance records', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await assetMaintenanceService.complete(id);
      enqueueSnackbar('Maintenance marked as completed!', { variant: 'success' });
      fetchMaintenances();
    } catch (error) {
      console.error('Error completing maintenance:', error);
      enqueueSnackbar('Failed to complete maintenance', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'warning',
      'in-progress': 'info',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      <Helmet>
        <title>Asset Maintenance | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Asset Maintenance"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.list },
            { name: 'Maintenance' },
          ]}
          action={
            <Button
              component={RouterLink}
              to="/dashboard/assets/maintenance/new"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Schedule Maintenance
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {maintenances.map((maintenance) => (
                    <TableRow key={maintenance.id} hover>
                      <TableCell>{maintenance.asset_name || maintenance.asset_code || '-'}</TableCell>
                      <TableCell>{maintenance.maintenance_type || '-'}</TableCell>
                      <TableCell>
                        {maintenance.scheduled_date ? new Date(maintenance.scheduled_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        {maintenance.completed_date ? new Date(maintenance.completed_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>${maintenance.cost || 0}</TableCell>
                      <TableCell>
                        <Chip
                          label={maintenance.status || 'scheduled'}
                          color={getStatusColor(maintenance.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {maintenance.status !== 'completed' && maintenance.status !== 'cancelled' && (
                          <IconButton
                            onClick={() => handleComplete(maintenance.id)}
                            color="primary"
                          >
                            <Iconify icon="eva:checkmark-circle-2-fill" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && maintenances.length === 0 && (
                    <TableNoData isNotFound={true} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </>
  );
}

