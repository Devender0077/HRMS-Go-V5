import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
// services
import announcementService from '../../../services/announcementService';

// ----------------------------------------------------------------------

AnnouncementDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  announcement: PropTypes.object,
};

export default function AnnouncementDialog({ open, onClose, onSuccess, announcement }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    department_id: '',
    status: true,
  });

  const [loading, setLoading] = useState(false);

  const isEdit = !!announcement;

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        type: announcement.type || 'general',
        priority: announcement.priority || 'normal',
        department_id: announcement.department_id || '',
        status: announcement.status === 'active',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'general',
        priority: 'normal',
        department_id: '',
        status: true,
      });
    }
  }, [announcement]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = {
        ...formData,
        status: formData.status ? 'active' : 'inactive',
      };

      if (isEdit) {
        await announcementService.updateAnnouncement(announcement.id, data);
      } else {
        await announcementService.createAnnouncement(data);
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert(error.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'normal',
      department_id: '',
      status: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter announcement content"
            required
          />

          <TextField
            fullWidth
            select
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="general">General</MenuItem>
            <MenuItem value="important">Important</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="event">Event</MenuItem>
            <MenuItem value="policy">Policy Update</MenuItem>
            <MenuItem value="holiday">Holiday</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>

          <FormControlLabel
            control={<Switch checked={formData.status} onChange={handleChange} name="status" />}
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.title || !formData.content}
        >
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

