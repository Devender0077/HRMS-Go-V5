import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Box,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

const ToolCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[20],
    '& .tool-icon': {
      backgroundColor: color,
      color: theme.palette.common.white,
    },
  },
}));

const ToolIcon = styled(Box)(({ theme, color }) => ({
  width: 64,
  height: 64,
  borderRadius: theme.shape.borderRadius * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(color, 0.12),
  color,
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shorter,
  }),
  marginBottom: theme.spacing(2),
}));

// ----------------------------------------------------------------------

const PDF_TOOLS = [
  // EDIT PDF
  {
    category: 'Edit PDF',
    color: '#1890FF',
    tools: [
      {
        title: 'Edit Text & Images',
        description: 'Modify text and images directly in your PDF',
        icon: 'eva:edit-2-outline',
        path: '/dashboard/contracts/pdf-tools/edit-text',
        comingSoon: true,
      },
      {
        title: 'Add Comments',
        description: 'Annotate PDFs with comments and notes',
        icon: 'eva:message-square-outline',
        path: '/dashboard/contracts/pdf-tools/add-comments',
        comingSoon: true,
      },
      {
        title: 'Crop Pages',
        description: 'Trim and adjust page margins',
        icon: 'eva:crop-outline',
        path: '/dashboard/contracts/pdf-tools/crop',
        comingSoon: true,
      },
      {
        title: 'Number Pages',
        description: 'Add page numbers to your document',
        icon: 'eva:hash-outline',
        path: '/dashboard/contracts/pdf-tools/number-pages',
        comingSoon: true,
      },
    ],
  },
  // ORGANIZE PDF
  {
    category: 'Organize PDF',
    color: '#00AB55',
    tools: [
      {
        title: 'Merge PDFs',
        description: 'Combine multiple PDF files into one',
        icon: 'eva:layers-fill',
        path: '/dashboard/contracts/pdf-tools/merge',
      },
      {
        title: 'Split PDF',
        description: 'Separate pages into individual files',
        icon: 'eva:scissors-outline',
        path: '/dashboard/contracts/pdf-tools/split',
        comingSoon: true,
      },
      {
        title: 'Rotate Pages',
        description: 'Change page orientation',
        icon: 'eva:refresh-outline',
        path: '/dashboard/contracts/pdf-tools/rotate',
        comingSoon: true,
      },
      {
        title: 'Reorder Pages',
        description: 'Rearrange page sequence',
        icon: 'eva:swap-outline',
        path: '/dashboard/contracts/pdf-tools/reorder',
        comingSoon: true,
      },
      {
        title: 'Extract Pages',
        description: 'Pull out specific pages',
        icon: 'eva:file-text-outline',
        path: '/dashboard/contracts/pdf-tools/extract',
        comingSoon: true,
      },
      {
        title: 'Delete Pages',
        description: 'Remove unwanted pages',
        icon: 'eva:trash-2-outline',
        path: '/dashboard/contracts/pdf-tools/delete',
        comingSoon: true,
      },
    ],
  },
  // SECURE PDF
  {
    category: 'Secure PDF',
    color: '#7635DC',
    tools: [
      {
        title: 'Protect PDF',
        description: 'Add password protection',
        icon: 'eva:lock-outline',
        path: '/dashboard/contracts/pdf-tools/protect',
        comingSoon: true,
      },
      {
        title: 'Add Watermark',
        description: 'Brand your documents',
        icon: 'eva:droplet-outline',
        path: '/dashboard/contracts/pdf-tools/watermark',
        comingSoon: true,
      },
      {
        title: 'Compress PDF',
        description: 'Reduce file size while maintaining quality',
        icon: 'eva:archive-outline',
        path: '/dashboard/contracts/pdf-tools/compress',
      },
      {
        title: 'Edit Metadata',
        description: 'Update document properties',
        icon: 'eva:info-outline',
        path: '/dashboard/contracts/pdf-tools/metadata',
        comingSoon: true,
      },
    ],
  },
];

// ----------------------------------------------------------------------

export default function PDFToolsPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    if (tool.comingSoon) {
      // For now, just show a message
      // Later: open modal or show snackbar
      console.log('Coming soon:', tool.title);
      return;
    }
    navigate(tool.path);
  };

  return (
    <>
      <Helmet>
        <title>PDF Tools | Contract Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="PDF Tools"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools' },
          ]}
          sx={{ mb: 4 }}
        />

        <Stack spacing={5}>
          {PDF_TOOLS.map((category) => (
            <Box key={category.category}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 4,
                    borderRadius: 1,
                    bgcolor: category.color,
                  }}
                />
                <Typography variant="h4">{category.category}</Typography>
              </Stack>

              <Grid container spacing={3}>
                {category.tools.map((tool) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tool.title}>
                    <ToolCard color={category.color}>
                      <CardActionArea
                        onClick={() => handleToolClick(tool)}
                        sx={{ height: '100%', p: 3 }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <ToolIcon className="tool-icon" color={category.color}>
                            <Iconify icon={tool.icon} width={32} />
                          </ToolIcon>

                          <Stack spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="h6">{tool.title}</Typography>
                              {tool.comingSoon && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    bgcolor: 'warning.lighter',
                                    color: 'warning.darker',
                                    fontWeight: 600,
                                  }}
                                >
                                  Soon
                                </Typography>
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {tool.description}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </ToolCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Container>
    </>
  );
}
