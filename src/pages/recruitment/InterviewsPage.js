import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Card,
  Container,
  Grid,
  Stack,
  Button,
  Typography,
  Paper,
  Avatar,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import recruitmentService from '../../services/recruitmentService';

// ----------------------------------------------------------------------

const MOCK_INTERVIEWS = [
  { id: 1, candidate: 'Sarah Wilson', job: 'Marketing Lead', date: '2024-12-20', time: '10:00 AM', interviewer: 'John Doe', type: 'Technical', status: 'scheduled' },
  { id: 2, candidate: 'James Taylor', job: 'Sales Executive', date: '2024-12-20', time: '02:00 PM', interviewer: 'Jane Smith', type: 'HR Round', status: 'scheduled' },
  { id: 3, candidate: 'Michael Brown', job: 'HR Manager', date: '2024-12-21', time: '11:00 AM', interviewer: 'Bob Johnson', type: 'Final Round', status: 'scheduled' },
  { id: 4, candidate: 'Lisa Anderson', job: 'HR Manager', date: '2024-12-19', time: '03:00 PM', interviewer: 'Alice Williams', type: 'Technical', status: 'completed' },
];

// ----------------------------------------------------------------------

export default function InterviewsPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch interviews data
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      if (response.success && Array.isArray(response.data)) {
        // Filter applications that have interviews scheduled
        const interviewData = response.data.filter(app => 
          app.status === 'interviewed' || app.status === 'interview_scheduled'
        );
        setInterviews(interviewData);
      } else {
        setInterviews([]);
        enqueueSnackbar('No interviews found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setInterviews([]);
      enqueueSnackbar('Failed to load interviews', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const todayInterviews = interviews.filter(i => i.status === 'interview_scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'interviewed');

  return (
    <>
      <Helmet>
        <title> Recruitment: Interviews | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interview Schedule"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Recruitment' },
            { name: 'Interviews' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              Schedule Interview
            </Button>
          }
        />

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main">{todayInterviews.length}</Typography>
              <Typography variant="body2" color="text.secondary">Scheduled</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">{completedInterviews.length}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="info.main">{interviews.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">0</Typography>
              <Typography variant="body2" color="text.secondary">Cancelled</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Upcoming Interviews */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Interviews
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {todayInterviews.map((interview) => (
              <Paper key={interview.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar>{interview.candidate.charAt(0)}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{interview.candidate}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {interview.job}
                    </Typography>
                  </Box>
                  <Stack spacing={0.5} alignItems="flex-end">
                    <Chip label={interview.type} size="small" variant="outlined" />
                    <Typography variant="caption" color="text.secondary">
                      {interview.date} at {interview.time}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Interviewer: {interview.interviewer}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small">
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Iconify icon="eva:close-circle-fill" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Card>
      </Container>
    </>
  );
}

