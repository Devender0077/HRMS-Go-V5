import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5, 3),
  boxShadow: theme.customShadows.z8,
  cursor: 'pointer',
  position: 'relative',
  transition: theme.transitions.create(['all'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.customShadows.z24,
  },
}));

const StyledIcon = styled('div')(({ theme, color }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(10),
  height: theme.spacing(10),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette[color].darker,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.16)} 0%, ${alpha(
    theme.palette[color].main,
    0.16
  )} 100%)`,
}));

// ----------------------------------------------------------------------

const PDF_TOOLS = [
  {
    title: 'Merge PDFs',
    description: 'Combine multiple PDF files into one document',
    icon: 'eva:layers-fill',
    color: 'info',
    path: '/dashboard/contracts/pdf-tools/merge',
  },
  {
    title: 'Split PDF',
    description: 'Separate pages into individual files',
    icon: 'eva:scissors-outline',
    color: 'success',
    path: '/dashboard/contracts/pdf-tools/split',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: 'eva:archive-outline',
    color: 'warning',
    path: '/dashboard/contracts/pdf-tools/compress',
  },
  {
    title: 'Rotate Pages',
    description: 'Change page orientation',
    icon: 'eva:refresh-outline',
    color: 'info',
    path: '/dashboard/contracts/pdf-tools/rotate',
  },
  {
    title: 'Reorder Pages',
    description: 'Rearrange page sequence',
    icon: 'eva:swap-outline',
    color: 'success',
    path: '/dashboard/contracts/pdf-tools/reorder',
  },
  {
    title: 'Extract Pages',
    description: 'Pull out specific pages',
    icon: 'eva:copy-outline',
    color: 'primary',
    path: '/dashboard/contracts/pdf-tools/extract',
  },
  {
    title: 'Delete Pages',
    description: 'Remove unwanted pages',
    icon: 'eva:trash-2-outline',
    color: 'error',
    path: '/dashboard/contracts/pdf-tools/delete-pages',
  },
  {
    title: 'Edit Text & Images',
    description: 'Modify text and images in your PDF',
    icon: 'eva:edit-2-outline',
    color: 'primary',
    path: '/dashboard/contracts/pdf-tools/edit-text',
  },
  {
    title: 'Add Comments',
    description: 'Annotate PDFs with comments',
    icon: 'eva:message-square-outline',
    color: 'info',
    path: '/dashboard/contracts/pdf-tools/add-comments',
  },
  {
    title: 'Crop Pages',
    description: 'Trim and adjust page margins',
    icon: 'eva:crop-outline',
    color: 'warning',
    path: '/dashboard/contracts/pdf-tools/crop',
  },
  {
    title: 'Number Pages',
    description: 'Add page numbers to document',
    icon: 'eva:hash-outline',
    color: 'success',
    path: '/dashboard/contracts/pdf-tools/number-pages',
  },
  {
    title: 'Protect PDF',
    description: 'Add password protection',
    icon: 'eva:lock-outline',
    color: 'error',
    path: '/dashboard/contracts/pdf-tools/protect',
  },
  {
    title: 'Add Watermark',
    description: 'Brand your documents',
    icon: 'eva:droplet-outline',
    color: 'primary',
    path: '/dashboard/contracts/pdf-tools/watermark',
  },
  {
    title: 'Edit Metadata',
    description: 'Update document properties',
    icon: 'eva:info-outline',
    color: 'info',
    path: '/dashboard/contracts/pdf-tools/metadata',
  },
];

// ----------------------------------------------------------------------

export default function PDFToolsPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>PDF Tools | Contract Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} component={MotionViewport}>
        <CustomBreadcrumbs
          heading="PDF Tools"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools' },
          ]}
          sx={{ mb: 5 }}
        />

        <Box
          sx={{
            mb: 5,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          }}
        >
          <Typography variant="h3" paragraph>
            Professional PDF Tools
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720, mx: 'auto' }}>
            Edit, organize, and secure your PDF documents with our comprehensive toolkit. 
            All tools are designed to maintain document quality while providing powerful features.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {PDF_TOOLS.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tool.title}>
              <m.div variants={varFade().inUp}>
                <StyledCard onClick={() => navigate(tool.path)}>
                  <StyledIcon color={tool.color}>
                    <Iconify icon={tool.icon} width={48} />
                  </StyledIcon>

                  <Typography variant="h5" paragraph>
                    {tool.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {tool.description}
                  </Typography>

                  <Button
                    variant="contained"
                    color={tool.color}
                    endIcon={<Iconify icon="eva:arrow-forward-fill" />}
                    sx={{ mt: 3 }}
                    onClick={() => navigate(tool.path)}
                  >
                    Open Tool
                  </Button>
                </StyledCard>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
