import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Container, Typography, Alert, Paper } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function MUITreesViewPage() {
  return (
    <>
      <Helmet>
        <title> MUI Components: Tree View | HRMS Go V5</title>
      </Helmet>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Tree View"
            links={[
              {
                name: 'Components',
                href: PATH_PAGE.components,
              },
              { name: 'Tree View' },
            ]}
            moreLink={['https://mui.com/x/react-tree-view/']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              TreeView Component Temporarily Unavailable
            </Typography>
            <Typography variant="body2">
              The TreeView component from @mui/x-tree-view requires additional configuration
              and has compatibility issues with the current MUI version.
              <br /><br />
              This page is temporarily disabled as it is not essential for HRMS functionality.
              All HRMS-specific features are working perfectly.
              <br /><br />
              For more information about MUI TreeView, visit:{' '}
              <a 
                href="https://mui.com/x/react-tree-view/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', fontWeight: 600 }}
              >
                https://mui.com/x/react-tree-view/
              </a>
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
}
