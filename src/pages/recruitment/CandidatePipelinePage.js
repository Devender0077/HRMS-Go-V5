import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Container,
  Grid,
  Card,
  CardHeader,
  Stack,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
  MenuItem,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import recruitmentService from '../../services/recruitmentService';
import MenuPopover from '../../components/menu-popover';
import apiClient from '../../utils/axios';

// ----------------------------------------------------------------------

const PIPELINE_STAGES = [
  { id: 'applied', title: 'Applied', color: '#2196f3' },
  { id: 'screening', title: 'Screening', color: '#ff9800' },
  { id: 'interview', title: 'Interview', color: '#9c27b0' },
  { id: 'offer', title: 'Offer', color: '#4caf50' },
  { id: 'hired', title: 'Hired', color: '#00bcd4' },
];

const MOCK_CANDIDATES = {
  applied: [
    { id: 1, name: 'John Smith', job: 'Software Engineer', email: 'john@email.com', avatar: '' },
    { id: 2, name: 'Emma Davis', job: 'Software Engineer', email: 'emma@email.com', avatar: '' },
  ],
  screening: [
    { id: 3, name: 'Michael Brown', job: 'HR Manager', email: 'michael@email.com', avatar: '' },
  ],
  interview: [
    { id: 4, name: 'Sarah Wilson', job: 'Marketing Lead', email: 'sarah@email.com', avatar: '' },
    { id: 5, name: 'James Taylor', job: 'Sales Executive', email: 'james@email.com', avatar: '' },
  ],
  offer: [
    { id: 6, name: 'Lisa Anderson', job: 'HR Manager', email: 'lisa@email.com', avatar: '' },
  ],
  hired: [],
};

// ----------------------------------------------------------------------

export default function CandidatePipelinePage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  // Initialize as object with stage IDs as keys
  const [pipeline, setPipeline] = useState(
    PIPELINE_STAGES.reduce((acc, stage) => ({
      ...acc,
      [stage.id]: []
    }), {})
  );
  const [loading, setLoading] = useState(true);
  const [candidateMenuAnchor, setCandidateMenuAnchor] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsCandidate, setDetailsCandidate] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return '';
    if (resumePath.startsWith('http')) return resumePath;
    const base = apiClient.defaults?.baseURL || '';
    const stripped = base.replace(/\/api\/?$/, '');
    return `${stripped}${resumePath.startsWith('/') ? '' : '/'}${resumePath}`;
  };

  const handleOpenDetails = (candidate) => {
    setDetailsCandidate(candidate);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setDetailsCandidate(null);
  };

  const handleDragStart = (event, candidate, fromStage) => {
    try {
      const payload = JSON.stringify({ id: String(candidate.id), fromStage });
      event.dataTransfer.setData('text/plain', payload);
      event.dataTransfer.effectAllowed = 'move';
      setDraggingId(String(candidate.id));
    } catch (err) {
      // ignore
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDrop = (event, toStage) => {
    event.preventDefault();
    try {
      const raw = event.dataTransfer.getData('text/plain');
      if (!raw) return;
      const { id, fromStage } = JSON.parse(raw);
      if (!id) return;
      if (fromStage === toStage) return;
      // optimistic UI update
      const prevState = pipeline;
      const newState = { ...prevState };
      const sourceList = Array.isArray(newState[fromStage]) ? [...newState[fromStage]] : [];
      const targetList = Array.isArray(newState[toStage]) ? [...newState[toStage]] : [];
      const idx = sourceList.findIndex((c) => String(c.id) === String(id));
      if (idx === -1) return;
      const [moving] = sourceList.splice(idx, 1);
      targetList.unshift(moving);
      newState[fromStage] = sourceList;
      newState[toStage] = targetList;
      setPipeline(newState);
      setDraggingId(null);

      // persist change to backend (update application status)
      (async () => {
        try {
          // moving.raw should contain the original application object
          const appId = moving?.raw?.id || moving?.raw?._id || moving.id || id;
          if (!appId) throw new Error('Missing application id');
          const res = await recruitmentService.updateApplicationStatus(appId, toStage);
          if (res && res.success) {
            enqueueSnackbar('Candidate moved', { variant: 'success' });
          } else {
            // revert UI
            setPipeline(prevState);
            enqueueSnackbar(res?.message || 'Failed to update candidate status on server', { variant: 'error' });
          }
        } catch (err) {
          console.error('Failed to persist candidate move', err);
          setPipeline(prevState);
          enqueueSnackbar('Failed to update candidate status on server', { variant: 'error' });
        }
      })();
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  // Fetch pipeline data
  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      if (response.success && Array.isArray(response.data)) {
        // Normalize applications into simple candidate objects and group by status
        const apps = response.data;

        const groupedData = PIPELINE_STAGES.reduce((acc, stage) => ({
          ...acc,
          [stage.id]: (
            apps
              .filter((app) => (app.status || '').toString() === stage.id)
              .map((app) => ({
                id: app.id || app._id || `${app.candidate_name || app.name || 'cand'}-${Math.random().toString(36).slice(2,7)}`,
                name: app.candidate_name || app.name || app.applicant_name || app.full_name || app.email || 'Unknown',
                job: (app.job && (app.job.title || app.job.name)) || app.job_title || app.position || '',
                email: app.email || app.candidate_email || '',
                avatar: app.avatar || '',
                raw: app,
              }))
          ) || []
        }), {});

        setPipeline(groupedData);
      } else {
        // Set empty arrays for all stages
        setPipeline(PIPELINE_STAGES.reduce((acc, stage) => ({
          ...acc,
          [stage.id]: []
        }), {}));
      }
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
      // Set empty arrays for all stages
      setPipeline(PIPELINE_STAGES.reduce((acc, stage) => ({
        ...acc,
        [stage.id]: []
      }), {}));
      enqueueSnackbar('Failed to load pipeline data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchPipeline is a local function; call on mount
    fetchPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Recruitment: Candidate Pipeline | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : false}>
        <CustomBreadcrumbs
          heading="Candidate Pipeline"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.app },
            { name: 'Recruitment' },
            { name: 'Pipeline' },
          ]}
        />

        <Grid container spacing={3}>
          {PIPELINE_STAGES.map((stage) => (
            <Grid item xs={12} md={2.4} key={stage.id}>
              <Card>
                <CardHeader
                  title={stage.title}
                  subheader={`${pipeline[stage.id].length} candidates`}
                  sx={{
                    bgcolor: stage.color,
                    color: 'white',
                    '& .MuiCardHeader-subheader': { color: 'rgba(255,255,255,0.8)' },
                  }}
                />
                <Stack
                  spacing={2}
                  sx={{ p: 2, minHeight: 400 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {pipeline[stage.id].map((candidate) => (
                    <Paper
                      key={candidate.id}
                      sx={{
                        p: 2,
                        cursor: 'move',
                        '&:hover': { boxShadow: 3 },
                        transition: 'all 0.2s',
                        opacity: draggingId && String(draggingId) === String(candidate.id) ? 0.5 : 1,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate, stage.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Avatar>{candidate.name ? candidate.name.charAt(0) : '?'}</Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {candidate.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {candidate.job}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            {candidate.email}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => {
                          setCandidateMenuAnchor(e.currentTarget);
                          setSelectedCandidate(candidate);
                        }}>
                          <Iconify icon="eva:more-vertical-fill" width={16} />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                  {/* Candidate menu popover (shared) */}
                  <MenuPopover
                    open={candidateMenuAnchor}
                    onClose={() => {
                      setCandidateMenuAnchor(null);
                      setSelectedCandidate(null);
                    }}
                    arrow="right-top"
                    sx={{ width: 180 }}
                  >
                    <MenuItem onClick={() => {
                      setCandidateMenuAnchor(null);
                      handleOpenDetails(selectedCandidate);
                    }}>
                      <Iconify icon="eva:eye-fill" />
                      View Details
                    </MenuItem>

                    <MenuItem onClick={() => {
                      setCandidateMenuAnchor(null);
                      const resumePath = selectedCandidate?.raw?.resume_path || selectedCandidate?.raw?.resume || '';
                      if (resumePath) {
                        const url = getResumeUrl(resumePath);
                        if (url) window.open(url, '_blank');
                        else enqueueSnackbar('No resume available for this candidate', { variant: 'warning' });
                      } else {
                        enqueueSnackbar('No resume available for this candidate', { variant: 'warning' });
                      }
                    }}>
                      <Iconify icon="eva:download-fill" />
                      Open Resume
                    </MenuItem>

                    <MenuItem onClick={() => {
                      // Remove candidate from current stage in UI
                      setCandidateMenuAnchor(null);
                      if (!selectedCandidate) return;
                      setPipeline((prev) => {
                        const newState = { ...prev };
                        Object.keys(newState).forEach((k) => {
                          newState[k] = newState[k].filter(c => c.id !== selectedCandidate.id);
                        });
                        return newState;
                      });
                      enqueueSnackbar('Candidate removed from pipeline (UI only)', { variant: 'success' });
                    }} sx={{ color: 'error.main' }}>
                      <Iconify icon="eva:trash-2-fill" />
                      Remove
                    </MenuItem>
                  </MenuPopover>

      {/* Candidate Details Dialog */}
      <Dialog open={openDetails} onClose={handleCloseDetails} fullWidth maxWidth="sm">
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent dividers>
          {detailsCandidate ? (
            (() => {
              const a = detailsCandidate.raw || {};
              const applicantName = a.candidate_name || a.name || a.applicant_name || detailsCandidate.name || '';
              const applicantEmail = a.email || detailsCandidate.email || '';
              const applicantPhone = a.phone || a.contact || '';
              const jobTitle = (a.job && (a.job.title || a.job.name)) || a.job_title || detailsCandidate.job || '';
              const appliedDate = a.applied_date || a.created_at || a.appliedAt || a.createdAt || '';
              const experience = a.experience || a.years_experience || detailsCandidate.raw?.experience || '';
              const currentCompany = a.current_company || a.company || '';
              const coverLetter = a.cover_letter || a.coverLetter || '';
              const status = a.status || '';
              const notes = a.notes || a.note || '';
              const resumePath = a.resume_path || a.resume || detailsCandidate.raw?.resume_path || '';

              return (
                <Stack spacing={1} sx={{ pt: 1 }}>
                  <Typography variant="subtitle1">{applicantName}</Typography>
                  <Typography variant="body2" color="text.secondary">{applicantEmail}</Typography>
                  <Typography variant="body2">Phone: {applicantPhone}</Typography>
                  <Typography variant="body2">Job: {jobTitle}</Typography>
                  {appliedDate && (
                    <Typography variant="body2">Applied: {new Date(appliedDate).toLocaleString()}</Typography>
                  )}
                  <Typography variant="body2">Experience: {experience}</Typography>
                  {currentCompany && (
                    <Typography variant="body2">Current Company: {currentCompany}</Typography>
                  )}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>Cover Letter: {coverLetter}</Typography>
                  {status && (
                    <Typography variant="body2">Status: {status.replace('_', ' ')}</Typography>
                  )}
                  {notes && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>Notes: {notes}</Typography>
                  )}
                  <Box sx={{ mt: 1 }}>
                    {resumePath ? (
                      <Link href={getResumeUrl(resumePath)} target="_blank" rel="noopener" underline="hover">Open Resume</Link>
                    ) : (
                      <Typography variant="caption" color="text.secondary">No resume available</Typography>
                    )}
                  </Box>
                </Stack>
              );
            })()
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
                  {pipeline[stage.id].length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Typography variant="caption" color="text.disabled">
                        No candidates
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

