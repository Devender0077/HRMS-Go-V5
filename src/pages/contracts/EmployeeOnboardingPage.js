import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  Stack,
  Box,
  LinearProgress,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
// services
import { apiClient } from '../../services/api/authService';
// utils
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

export default function EmployeeOnboardingPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchOnboardingDocuments();
  }, []);

  const fetchOnboardingDocuments = async () => {
    setLoading(true);
    try {
      // TODO: Create endpoint for employee onboarding documents
      const response = await apiClient.get('/employee-onboarding-documents/my-documents');

      if (response.data?.success) {
        const docs = response.data?.data || [];
        setDocuments(docs);

        // Calculate stats
        const stats = {
          total: docs.length,
          completed: docs.filter(d => d.status === 'completed').length,
          pending: docs.filter(d => d.status === 'pending' || d.status === 'sent' || d.status === 'in_progress').length,
          overdue: docs.filter(d => d.status === 'overdue').length,
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('❌ Error fetching onboarding documents:', error);
      // For now, show mock data for demonstration
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      pending: 'warning',
      sent: 'info',
      in_progress: 'warning',
      overdue: 'error',
      waived: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: 'eva:checkmark-circle-2-fill',
      pending: 'eva:clock-fill',
      sent: 'eva:paper-plane-fill',
      in_progress: 'eva:edit-2-fill',
      overdue: 'eva:alert-triangle-fill',
      waived: 'eva:minus-circle-fill',
    };
    return icons[status] || 'eva:file-text-fill';
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <>
      <Helmet>
        <title> Onboarding | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Complete Your Onboarding"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Onboarding' },
          ]}
        />

        {/* Progress Overview */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <div>
                <Typography variant="h4">Welcome to HRMS Go!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please complete the following documents to finish your onboarding process.
                </Typography>
              </div>
              <Chip
                label={`${completionPercentage}% Complete`}
                color={completionPercentage === 100 ? 'success' : 'warning'}
                sx={{ fontSize: 16, height: 36, px: 2 }}
              />
            </Stack>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {stats.completed} of {stats.total} documents completed
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                color={completionPercentage === 100 ? 'success' : 'primary'}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>

            {stats.overdue > 0 && (
              <Alert severity="error" icon={<Iconify icon="eva:alert-triangle-fill" />}>
                You have {stats.overdue} overdue document{stats.overdue !== 1 ? 's' : ''}. Please complete them as soon as possible.
              </Alert>
            )}
          </Stack>
        </Card>

        {/* Documents List */}
        <Grid container spacing={3}>
          {documents.length === 0 && !loading && (
            <Grid item xs={12}>
              <Card sx={{ p: 6, textAlign: 'center' }}>
                <Iconify icon="eva:checkmark-circle-2-fill" sx={{ width: 80, height: 80, color: 'success.main', mx: 'auto', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 1 }}>
                  All Set!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You've completed all required onboarding documents.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  onClick={() => navigate(PATH_DASHBOARD.root)}
                >
                  Go to Dashboard
                </Button>
              </Card>
            </Grid>
          )}

          {documents.map((doc) => (
            <Grid item xs={12} md={6} key={doc.id}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Stack spacing={2} height="100%">
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify
                        icon={getStatusIcon(doc.status)}
                        sx={{ width: 24, height: 24, color: 'primary.main' }}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" noWrap>
                        {doc.documentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {doc.documentType}
                      </Typography>
                    </Box>
                    <Chip
                      label={doc.status}
                      color={getStatusColor(doc.status)}
                      size="small"
                    />
                  </Stack>

                  {doc.dueDate && (
                    <Typography variant="caption" color="text.secondary">
                      Due: {fDate(doc.dueDate)}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    {doc.status === 'completed' ? (
                      <>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                          color="success"
                          disabled
                        >
                          Completed
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:download-fill" />}
                          onClick={() => {
                            // TODO: Download signed document
                            enqueueSnackbar('Download coming soon', { variant: 'info' });
                          }}
                        >
                          Download
                        </Button>
                      </>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Iconify icon="eva:edit-2-fill" />}
                        onClick={() => {
                          if (doc.contractInstanceId) {
                            navigate(`/dashboard/contracts/sign/${doc.contractInstanceId}`);
                          } else {
                            enqueueSnackbar('Contract not yet generated', { variant: 'warning' });
                          }
                        }}
                      >
                        {doc.status === 'in_progress' ? 'Continue Signing' : 'Sign Now'}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

