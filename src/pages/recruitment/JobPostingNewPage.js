import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Card, Stack, TextField, Button, Grid } from '@mui/material';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import recruitmentService from '../../services/recruitmentService';

export default function JobPostingNewPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'full_time',
    positions: 1,
    salary_range: '',
    experience_required: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        department: form.department,
        location: form.location,
        employment_type: form.employment_type,
        positions: Number(form.positions),
        salary_range: form.salary_range,
        experience_required: form.experience_required,
        description: form.description,
        status: 'open',
      };

      const res = await recruitmentService.createJobPosting(payload);
      if (res && res.success) {
        enqueueSnackbar('Job posting created', { variant: 'success' });
        // navigate back to job postings and signal list to refresh
        // Use the .root string (e.g. '/dashboard/recruitment/jobs') instead of the jobs object
        navigate(PATH_DASHBOARD.recruitment.jobs.root, { state: { refresh: true } });
      } else {
        enqueueSnackbar(res?.message || 'Failed to create job posting', { variant: 'error' });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to create job posting', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>New Job Posting | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Job Posting"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Recruitment', href: PATH_DASHBOARD.recruitment.root },
            { name: 'Job Postings', href: PATH_DASHBOARD.recruitment.jobs },
            { name: 'New' },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Job Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Employment Type"
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                    select
                    fullWidth
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Positions"
                    name="positions"
                    type="number"
                    value={form.positions}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Salary Range"
                    name="salary_range"
                    value={form.salary_range}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Experience Required"
                    name="experience_required"
                    value={form.experience_required}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={4}
                  />
                </Grid>
              </Grid>

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" startIcon={<Iconify icon="eva:checkmark-fill" />} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Job'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </>
  );
}
