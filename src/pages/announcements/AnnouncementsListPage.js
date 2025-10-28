import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { TableHeadCustom, TableNoData } from '../../components/table';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { PATH_DASHBOARD } from '../../routes/paths';
// services
import announcementService from '../../services/announcementService';
// sections
import AnnouncementDialog from '../../sections/@dashboard/announcement/AnnouncementDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'priority', label: 'Priority', alignRight: false },
  { id: 'author', label: 'Author', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'publish_date', label: 'Publish Date', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: true },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Company Holiday Schedule 2024',
    type: 'General',
    priority: 'high',
    author: 'HR Department',
    author_avatar: '/assets/images/avatars/avatar_1.jpg',
    status: 'published',
    publish_date: '2024-01-15',
    content: 'Please find attached the company holiday schedule for 2024...',
    read_count: 45,
    total_employees: 50,
  },
  {
    id: 2,
    title: 'New Office Policy Update',
    type: 'Policy',
    priority: 'medium',
    author: 'John Doe',
    author_avatar: '/assets/images/avatars/avatar_2.jpg',
    status: 'published',
    publish_date: '2024-01-14',
    content: 'We have updated our office policy regarding remote work...',
    read_count: 32,
    total_employees: 50,
  },
  {
    id: 3,
    title: 'Team Building Event',
    type: 'Event',
    priority: 'low',
    author: 'Jane Smith',
    author_avatar: '/assets/images/avatars/avatar_3.jpg',
    status: 'draft',
    publish_date: '2024-01-16',
    content: 'Join us for our monthly team building event...',
    read_count: 0,
    total_employees: 50,
  },
  {
    id: 4,
    title: 'System Maintenance Notice',
    type: 'Technical',
    priority: 'high',
    author: 'IT Department',
    author_avatar: '/assets/images/avatars/avatar_4.jpg',
    status: 'published',
    publish_date: '2024-01-13',
    content: 'The system will be under maintenance from 2 AM to 4 AM...',
    read_count: 48,
    total_employees: 50,
  },
  {
    id: 5,
    title: 'Welcome New Employees',
    type: 'Welcome',
    priority: 'medium',
    author: 'HR Department',
    author_avatar: '/assets/images/avatars/avatar_1.jpg',
    status: 'published',
    publish_date: '2024-01-12',
    content: 'Please welcome our new team members...',
    read_count: 28,
    total_employees: 50,
  },
];

// ----------------------------------------------------------------------

export default function AnnouncementsListPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('publish_date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openPopover, setOpenPopover] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      console.log('🔄 [Announcements] Fetching announcements...');
      
      const response = await announcementService.getAllAnnouncements();
      console.log('📥 [Announcements] Response:', response);
      
      if (response.success && Array.isArray(response.data)) {
        // Map backend data to frontend expected format
        const mappedAnnouncements = response.data.map(ann => ({
          ...ann,
          author: ann.author_name || ann.author || 'Unknown',
          type: ann.type || 'General',
          publish_date: ann.published_at || ann.created_at,
        }));
        
        console.log(`✅ [Announcements] Loaded ${mappedAnnouncements.length} announcements`);
        setAnnouncements(mappedAnnouncements);
      } else {
        console.log('⚠️ [Announcements] No announcements found or invalid response');
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('❌ [Announcements] Error fetching:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedAnnouncement(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAnnouncement(null);
  };

  const handleEditAnnouncement = () => {
    setOpenDialog(true);
    handleClosePopover();
  };

  const handleDeleteClick = () => {
    setOpenConfirm(true);
    handleClosePopover();
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedAnnouncement) {
        const response = await announcementService.deleteAnnouncement(selectedAnnouncement.id);
        if (response.success) {
          enqueueSnackbar('Announcement deleted successfully', { variant: 'success' });
          fetchAnnouncements();
        } else {
          enqueueSnackbar(response.message || 'Failed to delete announcement', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      enqueueSnackbar('Error deleting announcement', { variant: 'error' });
    } finally {
      setOpenConfirm(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleViewAnnouncement = () => {
    setOpenViewDialog(true);
    handleClosePopover();
  };

  const handleDuplicateAnnouncement = () => {
    // Create a copy without the ID for duplicating
    const duplicated = {
      ...selectedAnnouncement,
      title: `${selectedAnnouncement.title} (Copy)`,
      id: undefined, // Remove ID so it creates new
    };
    setSelectedAnnouncement(duplicated);
    setOpenDialog(true);
    handleClosePopover();
  };

  const handleDialogSuccess = () => {
    fetchAnnouncements();
  };

  const handleOpenPopover = (event, announcement) => {
    setOpenPopover(event.currentTarget);
    setSelectedAnnouncement(announcement);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
    setSelectedAnnouncement(null);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'General':
        return 'primary';
      case 'Policy':
        return 'secondary';
      case 'Event':
        return 'success';
      case 'Technical':
        return 'warning';
      case 'Welcome':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(filterName.toLowerCase()) ||
    announcement.type.toLowerCase().includes(filterName.toLowerCase()) ||
    announcement.author.toLowerCase().includes(filterName.toLowerCase())
  );

  const isNotFound = !filteredAnnouncements.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Announcements | HRMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Announcements"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Announcements' },
          ]}
          action={
            <Button
              onClick={handleOpenDialog}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Announcement
            </Button>
          }
        />

        <Card>
          <Stack spacing={2} sx={{ p: 3 }}>
            <TextField
              fullWidth
              placeholder="Search announcements..."
              value={filterName}
              onChange={handleFilterName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filteredAnnouncements.length}
                />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAnnouncements
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {row.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.content.substring(0, 50)}...
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.type}
                            color={getTypeColor(row.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.priority}
                            color={getPriorityColor(row.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar src={row.author_avatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2">{row.author}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(row.publish_date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleOpenPopover(e, row)}>
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {!loading && isNotFound && (
                    <TableNoData
                      isNotFound={isNotFound}
                      message={`No results found for "${filterName}"`}
                    />
                  )}

                  {!loading && !filteredAnnouncements.length && !filterName && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Iconify 
                            icon="eva:megaphone-outline" 
                            width={64} 
                            sx={{ color: 'text.disabled', mb: 2 }} 
                          />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No announcements yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Create your first announcement to keep everyone informed
                          </Typography>
                          <Button
                            onClick={handleOpenDialog}
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                          >
                            New Announcement
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAnnouncements.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleViewAnnouncement}>
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <MenuItem onClick={handleEditAnnouncement}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDuplicateAnnouncement}>
          <Iconify icon="eva:copy-fill" />
          Duplicate
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteClick}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <AnnouncementDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleDialogSuccess}
        announcement={selectedAnnouncement}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete Announcement"
        content={
          <>
            Are you sure you want to delete announcement <strong>{selectedAnnouncement?.title}</strong>?
            This action cannot be undone.
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        }
      />

      {/* View Announcement Dialog */}
      <Dialog 
        open={openViewDialog} 
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{selectedAnnouncement?.title}</Typography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Type
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedAnnouncement?.type || 'General'}
                  color={getTypeColor(selectedAnnouncement?.type)}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={selectedAnnouncement?.priority || 'normal'}
                  color={getPriorityColor(selectedAnnouncement?.priority)}
                  size="small"
                />
                <Chip
                  label={selectedAnnouncement?.status || 'published'}
                  color={getStatusColor(selectedAnnouncement?.status)}
                  size="small"
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Author
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                <Avatar src={selectedAnnouncement?.author_avatar} sx={{ width: 32, height: 32 }} />
                <Typography variant="body2">{selectedAnnouncement?.author}</Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Published Date
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {selectedAnnouncement?.publish_date ? 
                  new Date(selectedAnnouncement.publish_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 
                  'N/A'
                }
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Content
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {selectedAnnouncement?.content}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setOpenViewDialog(false);
              setOpenDialog(true);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

