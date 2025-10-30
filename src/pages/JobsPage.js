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
  TextField,
  Box,
  Chip,
} from '@mui/material';
// services
import recruitmentService from '../services/recruitmentService';
// components
import Iconify from '../components/iconify';
import { useSnackbar } from '../components/snackbar';

export default function JobsPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openApply, setOpenApply] = useState(false);
  const [openApps, setOpenApps] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [form, setForm] = useState({ candidate_name: '', email: '', phone: '', experience: '', current_company: '', cover_letter: '', resume: '' });
  const [applications, setApplications] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
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

  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setForm({ candidate_name: '', email: '', phone: '', experience: '', current_company: '', cover_letter: '', resume: '' });
    setResumeFile(null);
    setOpenApply(true);
  };

  const handleCloseApply = () => {
    setOpenApply(false);
    setSelectedJob(null);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;
    try {
      // helper to convert file to base64 data URL
      const fileToDataUrl = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

      let res;
      if (resumeFile) {
        // Many backends don't accept multipart/form-data here; to be safer send JSON with base64 payload
        const dataUrl = await fileToDataUrl(resumeFile);
        const payload = {
          job_id: selectedJob.id,
          candidate_name: form.candidate_name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          current_company: form.current_company,
          cover_letter: form.cover_letter,
          resume_path: resumeFile.name,
          resume_base64: dataUrl,
          status: 'submitted',
        };
        res = await recruitmentService.createJobApplication(payload);
      } else {
        const payload = {
          job_id: selectedJob.id,
          candidate_name: form.candidate_name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          current_company: form.current_company,
          cover_letter: form.cover_letter,
          resume: form.resume,
          status: 'submitted',
        };
        res = await recruitmentService.createJobApplication(payload);
      }
      if (res && res.success) {
        enqueueSnackbar('Application submitted', { variant: 'success' });
        handleCloseApply();
      } else {
        enqueueSnackbar(res?.message || 'Failed to submit application', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      enqueueSnackbar('Failed to submit application', { variant: 'error' });
    }
  };

  

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
                        onClick={() => handleOpenApply(job)}
                        startIcon={<Iconify icon="eva:checkmark-circle-2" />}
                        sx={{ minWidth: 140 }}
                      >
                        Apply
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

      <Dialog open={openApply} onClose={handleCloseApply} fullWidth maxWidth="sm">
        <DialogTitle>Apply for: {selectedJob?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full name" fullWidth value={form.candidate_name} onChange={(e) => setForm({ ...form, candidate_name: e.target.value })} />
            <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField label="Years of experience" fullWidth value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            <TextField label="Current company" fullWidth value={form.current_company} onChange={(e) => setForm({ ...form, current_company: e.target.value })} />

            <TextField label="Cover letter" fullWidth multiline minRows={4} value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} />

            <Box>
              <Button variant="outlined" component="label" startIcon={<Iconify icon="eva:attach-2-outline" />}>
                Upload Resume (PDF)
                <input
                  hidden
                  accept="application/pdf"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      if (file.type !== 'application/pdf') {
                        enqueueSnackbar('Only PDF files are allowed for resume', { variant: 'warning' });
                        return;
                      }
                      setResumeFile(file);
                      setForm((f) => ({ ...f, resume: file.name }));
                    }
                  }}
                />
              </Button>
              {resumeFile && (
                <Typography variant="caption" sx={{ ml: 1 }}>{resumeFile.name}</Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApply}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitApplication}>Submit Application</Button>
        </DialogActions>
      </Dialog>

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
