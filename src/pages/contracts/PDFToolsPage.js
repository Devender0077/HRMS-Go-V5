import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
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

const ToolCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.customShadows.z20,
  },
}));

const PDF_TOOLS = [
  {
    category: 'Edit PDF',
    description: 'Modify PDF content and structure',
    color: '#1890FF',
    icon: 'eva:edit-2-fill',
    tools: [
      { name: 'Edit Text & Images', icon: 'eva:edit-outline', path: '/edit-text', description: 'Modify or add text, images, and more' },
      { name: 'Add Comments', icon: 'eva:message-square-outline', path: '/add-comments', description: 'Add comments, highlights, and annotations' },
      { name: 'Crop Pages', icon: 'eva:crop-outline', path: '/crop-pages', description: 'Trim content, adjust margins, or resize pages' },
      { name: 'Number Pages', icon: 'eva:hash-outline', path: '/number-pages', description: 'Add page numbers to your PDF' },
    ],
  },
  {
    category: 'Organize PDF',
    description: 'Rearrange and manage PDF pages',
    color: '#7635dc',
    icon: 'eva:layers-fill',
    tools: [
      { name: 'Merge PDFs', icon: 'eva:layers-outline', path: '/merge', description: 'Combine multiple files into one PDF' },
      { name: 'Split PDF', icon: 'eva:scissors-outline', path: '/split', description: 'Separate a file into multiple PDFs' },
      { name: 'Rotate Pages', icon: 'eva:refresh-outline', path: '/rotate', description: 'Rotate pages left or right' },
      { name: 'Reorder Pages', icon: 'eva:swap-outline', path: '/reorder', description: 'Rearrange pages in your PDF' },
      { name: 'Extract Pages', icon: 'eva:copy-outline', path: '/extract', description: 'Create a new PDF of selected pages' },
      { name: 'Delete Pages', icon: 'eva:trash-2-outline', path: '/delete-pages', description: 'Remove pages from your PDF' },
    ],
  },
  {
    category: 'Secure PDF',
    description: 'Protect and secure your documents',
    color: '#00AB55',
    icon: 'eva:shield-fill',
    tools: [
      { name: 'Protect PDF', icon: 'eva:lock-outline', path: '/protect', description: 'Set password to protect PDF' },
      { name: 'Add Watermark', icon: 'eva:droplet-outline', path: '/watermark', description: 'Add watermark to pages' },
      { name: 'Compress PDF', icon: 'eva:archive-outline', path: '/compress', description: 'Reduce file size' },
      { name: 'Edit Metadata', icon: 'eva:info-outline', path: '/metadata', description: 'Edit title, author, keywords' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function PDFToolsPage() {
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();

  const handleToolClick = (category, tool) => {
    navigate(`/dashboard/contracts/pdf-tools${tool.path}`);
  };

  return (
    <>
      <Helmet>
        <title>PDF Tools | Contract Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="PDF Tools"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Contracts', href: PATH_DASHBOARD.contracts.root },
            { name: 'PDF Tools' },
          ]}
          sx={{ mb: 3 }}
        />

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Professional PDF editing tools for your documents. Edit, organize, and secure your contract templates and agreements.
        </Typography>

        <Stack spacing={4}>
          {PDF_TOOLS.map((category) => (
            <Box key={category.category}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(category.color, 0.12),
                  }}
                >
                  <Iconify icon={category.icon} width={28} sx={{ color: category.color }} />
                </Box>
                <Box>
                  <Typography variant="h5">{category.category}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2}>
                {category.tools.map((tool) => (
                  <Grid item xs={12} sm={6} md={4} key={tool.name}>
                    <ToolCard onClick={() => handleToolClick(category, tool)}>
                      <CardContent>
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: alpha(category.color, 0.08),
                            }}
                          >
                            <Iconify icon={tool.icon} width={24} sx={{ color: category.color }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              {tool.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tool.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
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

