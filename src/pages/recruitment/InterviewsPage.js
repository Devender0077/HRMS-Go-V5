import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
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
      // Prefer a dedicated interviews endpoint if available
      const res = await recruitmentService.getInterviews();
      let payload = [];
      if (res && res.success && Array.isArray(res.data)) payload = res.data;
      else if (Array.isArray(res)) payload = res;

      if (!payload.length) {
        // Fallback: derive interviews from applications (older API)
        const appsRes = await recruitmentService.getJobApplications();
        if (appsRes && appsRes.success && Array.isArray(appsRes.data)) {
          payload = appsRes.data
            .filter((app) => {
              // consider records with interview info or interview-status-like values
              const s = (app.status || '').toString().toLowerCase();
              return s === 'interview' || s === 'interviewed' || s === 'interview_scheduled' || app.interview_date || app.interview_time || app.interviewer;
            })
            .map((a) => ({
              id: a.id || a._id,
              candidate: a.candidate_name || a.name || a.applicant_name || a.email || 'Unknown',
              job: (a.job && (a.job.title || a.job.name)) || a.job_title || '',
              date: a.interview_date || a.date || a.applied_date || null,
              time: a.interview_time || a.time || null,
              interviewer: a.interviewer || a.interviewers || null,
              type: a.interview_type || a.type || null,
              status: a.status || (a.interview_date ? 'interview_scheduled' : ''),
            }));
        }
      }

      if (Array.isArray(payload) && payload.length) {
        // Normalize payload to expected interview objects
        const normalized = payload.map((it) => ({
          id: it.id || it._id,
          candidate: it.candidate || it.candidate_name || it.name || it.applicant_name || it.email || 'Unknown',
          job: it.job?.title || it.job?.name || it.job || it.job_title || '',
          date: it.date || it.interview_date || it.scheduled_date || null,
          time: it.time || it.interview_time || it.scheduled_time || null,
          interviewer: it.interviewer || (Array.isArray(it.interviewers) ? it.interviewers.join(', ') : it.interviewers) || null,
          type: it.type || it.interview_type || null,
          status: (it.status || '').toString(),
        }));

        setInterviews(normalized);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.recruitment.interviews.schedule}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
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
              <Avatar>{interview.candidate ? interview.candidate.charAt(0) : '?'}</Avatar>
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

