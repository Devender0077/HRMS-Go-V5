import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Button,
  Box,
} from '@mui/material';
// services
import recruitmentService from '../services/recruitmentService';
// components
import Iconify from '../components/iconify';
import { useSnackbar } from '../components/snackbar';

export default function JobDetailsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // If navigated from JobsPage we may already have the job in location.state — use it as an immediate fallback
  const initialJob = location?.state?.job ?? null;
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ candidate_name: '', email: '', phone: '', experience: '', current_company: '', cover_letter: '', resume: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // If we already have a job from navigation state, use it immediately and skip the network call
        if (initialJob) {
          // ensure normalization of the incoming job object
          const incoming = initialJob;
          const j = {
            id: incoming.id || incoming._id || incoming.jobId || id,
            title: incoming.title || incoming.job_title || incoming.name || 'Untitled',
            department: incoming.department || incoming.departmentName || 'General',
            location: incoming.location || 'Remote',
            employment_type: incoming.employment_type || incoming.type || 'full_time',
            positions: Number(incoming.positions ?? 1),
            description: incoming.description || incoming.summary || '',
          };
          setJob(j);
        } else {
          const res = await recruitmentService.getJobPosting(id);
          let payload = res && res.success && res.data ? res.data : res;
          if (payload) {
            // normalize
            const j = {
              id: payload.id || payload._id || payload.jobId || id,
              title: payload.title || payload.job_title || payload.name || 'Untitled',
              department: payload.department || payload.departmentName || 'General',
              location: payload.location || 'Remote',
              employment_type: payload.employment_type || payload.type || 'full_time',
              positions: Number(payload.positions ?? 1),
              description: payload.description || payload.summary || '',
            };
            setJob(j);
          } else {
            setJob(null);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        enqueueSnackbar('Failed to load job details', { variant: 'error' });
        setJob(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, enqueueSnackbar, initialJob]);

  const handleSubmit = async () => {
    if (!job) return;
    if (!form.candidate_name || !form.email) {
      enqueueSnackbar('Name and email are required', { variant: 'warning' });
      return;
    }
    try {
      setSubmitting(true);
      const fileToDataUrl = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

      let res;
      if (resumeFile) {
        const dataUrl = await fileToDataUrl(resumeFile);
        const payload = {
          job_id: job.id,
          candidate_name: form.candidate_name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          current_company: form.current_company,
          cover_letter: form.cover_letter,
          resume_path: resumeFile.name,
          resume_base64: dataUrl,
          status: 'applied',
        };
        res = await recruitmentService.createJobApplication(payload);
      } else {
        const payload = {
          job_id: job.id,
          candidate_name: form.candidate_name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          current_company: form.current_company,
          cover_letter: form.cover_letter,
          resume: form.resume,
          status: 'applied',
        };
        res = await recruitmentService.createJobApplication(payload);
      }

      if (res && res.success) {
        enqueueSnackbar('Application submitted', { variant: 'success' });
        navigate('/jobs');
      } else {
        enqueueSnackbar(res?.message || 'Failed to submit application', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      enqueueSnackbar('Failed to submit application', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{job ? `${job.title} | Apply` : 'Job Details | HRMS'}</title>
      </Helmet>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : !job ? (
                  <Typography>Job not found.</Typography>
                ) : (
                  <Stack spacing={2}>
                    <Typography variant="h4">{job.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{job.department} • {job.location}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Apply for this role</Typography>

                <Stack spacing={2}>
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
                    {resumeFile && <Typography variant="caption" sx={{ ml: 1 }}>{resumeFile.name}</Typography>}
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/jobs')}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Submit Application</Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
