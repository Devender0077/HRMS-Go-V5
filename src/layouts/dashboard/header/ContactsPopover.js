import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Typography, ListItemText, ListItemAvatar, MenuItem } from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// services
import employeeService from '../../../services/api/employeeService';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import MenuPopover from '../../../components/menu-popover';
import BadgeStatus from '../../../components/badge-status';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

export default function ContactsPopover() {
  const [openPopover, setOpenPopover] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees as contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll();
      const employees = Array.isArray(response) ? response : response.data || [];
      
      // Convert employees to contact format
      const contactsList = employees.slice(0, 12).map(emp => ({
        id: emp.id,
        name: `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.name || 'Unknown',
        avatar: emp.photo || emp.avatar || null,
        status: 'online', // Default status - can be enhanced later
        lastActivity: emp.last_login || new Date(),
      }));
      
      setContacts(contactsList);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Iconify icon="eva:people-fill" />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 320 }}>
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Contacts <Typography component="span">({contacts.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 6 }}>
          {loading ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              Loading contacts...
            </Typography>
          ) : contacts.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              No contacts found
            </Typography>
          ) : (
            contacts.map((contact) => (
              <MenuItem key={contact.id} sx={{ height: ITEM_HEIGHT }}>
                <ListItemAvatar>
                  <CustomAvatar
                    src={contact.avatar}
                    BadgeProps={{
                      badgeContent: <BadgeStatus status={contact.status} />,
                    }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={contact.name}
                  secondary={contact.status === 'offline' ? fToNow(contact.lastActivity) : ''}
                  primaryTypographyProps={{ typography: 'subtitle2', sx: { mb: 0.25 } }}
                  secondaryTypographyProps={{ typography: 'caption' }}
                />
              </MenuItem>
            ))
          )}
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
