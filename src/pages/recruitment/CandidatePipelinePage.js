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
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import recruitmentService from '../../services/recruitmentService';

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
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pipeline data
  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const response = await recruitmentService.getJobApplications();
      if (response.success && Array.isArray(response.data)) {
        // Group applications by status
        const groupedData = PIPELINE_STAGES.map(stage => ({
          ...stage,
          candidates: response.data.filter(app => app.status === stage.id)
        }));
        setPipeline(groupedData);
      } else {
        setPipeline(PIPELINE_STAGES.map(stage => ({ ...stage, candidates: [] })));
        enqueueSnackbar('No pipeline data found', { variant: 'info' });
      }
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
      setPipeline(PIPELINE_STAGES.map(stage => ({ ...stage, candidates: [] })));
      enqueueSnackbar('Failed to load pipeline data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
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
                <Stack spacing={2} sx={{ p: 2, minHeight: 400 }}>
                  {pipeline[stage.id].map((candidate) => (
                    <Paper
                      key={candidate.id}
                      sx={{
                        p: 2,
                        cursor: 'move',
                        '&:hover': { boxShadow: 3 },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Avatar>{candidate.name.charAt(0)}</Avatar>
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
                        <IconButton size="small">
                          <Iconify icon="eva:more-vertical-fill" width={16} />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
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

