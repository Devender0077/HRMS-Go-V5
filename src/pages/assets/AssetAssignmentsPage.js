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
import assetAssignmentService from '../../services/api/assetAssignmentService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'asset', label: 'Asset', alignRight: false },
  { id: 'employee', label: 'Assigned To', alignRight: false },
  { id: 'assigned_date', label: 'Assigned Date', alignRight: false },
  { id: 'return_date', label: 'Return Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

export default function AssetAssignmentsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await assetAssignmentService.getAll();
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      enqueueSnackbar('Failed to fetch assignments', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await assetAssignmentService.returnAsset(id);
      enqueueSnackbar('Asset returned successfully!', { variant: 'success' });
      fetchAssignments();
    } catch (error) {
      console.error('Error returning asset:', error);
      enqueueSnackbar('Failed to return asset', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'info',
      returned: 'success',
      lost: 'error',
      damaged: 'warning',
    };
    return colors[status] || 'default';
  };

  return (
    <>
      <Helmet>
        <title>Asset Assignments | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Asset Assignments"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Assets', href: PATH_DASHBOARD.assets.list },
            { name: 'Assignments' },
          ]}
          action={
            <Button
              component={RouterLink}
              to="/dashboard/assets/assignments/new"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Assign Asset
            </Button>
          }
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} hover>
                      <TableCell>{assignment.asset_name || assignment.asset_code || '-'}</TableCell>
                      <TableCell>{assignment.employee_name || '-'}</TableCell>
                      <TableCell>{assignment.assigned_date ? new Date(assignment.assigned_date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{assignment.return_date ? new Date(assignment.return_date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={assignment.status || 'assigned'}
                          color={getStatusColor(assignment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {assignment.status === 'assigned' && (
                          <IconButton
                            onClick={() => handleReturn(assignment.id)}
                            color="primary"
                          >
                            <Iconify icon="eva:corner-up-left-fill" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && assignments.length === 0 && (
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

