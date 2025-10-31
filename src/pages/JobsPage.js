import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
// services
import recruitmentService from '../services/recruitmentService';
// components
import Iconify from '../components/iconify';
import { useSnackbar } from '../components/snackbar';

export default function JobsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [openApps, setOpenApps] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [applications, setApplications] = useState([]);
  
  const [appCounts, setAppCounts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await recruitmentService.getJobPostings();
        let payload = [];
        if (res && res.success && Array.isArray(res.data)) payload = res.data;
        else if (Array.isArray(res)) payload = res;

        // normalize lightly
        const normalized = (payload || []).map((j, idx) => ({
          id: j.id || j._id || j.jobId || `${j.title || 'job'}-${idx}`,
          title: j.title || j.job_title || j.name || 'Untitled',
          department: j.department || j.departmentName || 'General',
          location: j.location || 'Remote',
          employment_type: j.employment_type || j.type || 'full_time',
          positions: Number(j.positions ?? 1),
          description: j.description || j.summary || '',
        }));

        setJobs(normalized);

        // fetch all applications and compute counts per job id
        try {
          const appsRes = await recruitmentService.getJobApplications();
          let appsPayload = [];
          if (appsRes && appsRes.success && Array.isArray(appsRes.data)) appsPayload = appsRes.data;
          else if (Array.isArray(appsRes)) appsPayload = appsRes;

          const counts = {};
          (appsPayload || []).forEach((a) => {
            const jid = String((a.job_id ?? a.jobId ?? a.job) || '');
            if (!jid) return;
            counts[jid] = (counts[jid] || 0) + 1;
          });
          setAppCounts(counts);
        } catch (err) {
          console.error('Error fetching applications for counts:', err);
          setAppCounts({});
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        enqueueSnackbar('Failed to load job postings', { variant: 'error' });
        setJobs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [enqueueSnackbar]);

  

  

  const handleCloseApplications = () => {
    setOpenApps(false);
    setSelectedJob(null);
    setApplications([]);
  };

  return (
    <>
      <Helmet>
        <title>Jobs | HRMS</title>
      </Helmet>

      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>Current Job Openings</Typography>

        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12}><Typography>Loading...</Typography></Grid>
          ) : jobs.length === 0 ? (
            <Grid item xs={12}><Typography>No job postings available.</Typography></Grid>
          ) : (
            jobs.map((job) => (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <Stack spacing={1}>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{job.department} • {job.location}</Typography>
                      <Box sx={{ mt: 1, minHeight: 88 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{job.description?.slice(0, 200)}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={job.employment_type?.replace('_', ' ')} size="small" />
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        disabled
                        sx={{ minWidth: 140 }}
                      >
                        {`${appCounts[String(job.id)] ?? 0} Applications`}
                      </Button>

                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
                        startIcon={<Iconify icon="eva:eye-fill" />}
                        sx={{ minWidth: 140 }}
                      >
                        View Details
                      </Button>

                      {/* buttons only in this row; employment type moved below description */}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      

      <Dialog open={openApps} onClose={handleCloseApplications} fullWidth maxWidth="md">
        <DialogTitle>Applications for: {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {applications.length === 0 ? (
            <Typography>No applications found for this job.</Typography>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {applications.map((a) => (
                <Box key={a.id || a._id || `${a.email}-${a.candidate_name}`} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2">{a.candidate_name || a.name || a.applicant_name}</Typography>
                  <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{a.resume || a.cover_letter || ''}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplications}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
