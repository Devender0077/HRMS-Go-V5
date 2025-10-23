import { useTranslation } from 'react-i18next';
// @mui
import { Grid } from '@mui/material';
// components
import { AnalyticsWidgetSummary } from '../general/analytics';

// ----------------------------------------------------------------------

export default function HRMSStatistics() {
  const { t } = useTranslation();

  const STATISTICS = [
    {
      title: t('dashboard.total_employees'),
      total: 156,
      icon: 'eva:people-fill',
      color: 'primary',
    },
    {
      title: t('dashboard.total_branches'),
      total: 8,
      icon: 'eva:briefcase-fill',
      color: 'info',
    },
    {
      title: t('dashboard.this_month_attendance'),
      total: '94.5%',
      icon: 'eva:clock-fill',
      color: 'success',
    },
    {
      title: t('dashboard.pending_leaves'),
      total: 12,
      icon: 'eva:calendar-fill',
      color: 'warning',
    },
    {
      title: t('dashboard.active_jobs'),
      total: 5,
      icon: 'eva:briefcase-outline',
      color: 'error',
    },
    {
      title: t('dashboard.total_candidates'),
      total: 48,
      icon: 'eva:person-add-fill',
      color: 'secondary',
    },
  ];

  return (
    <Grid container spacing={3}>
      {STATISTICS.map((stat, index) => (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title={stat.title}
            total={stat.total}
            icon={stat.icon}
            color={stat.color}
          />
        </Grid>
      ))}
    </Grid>
  );
}

