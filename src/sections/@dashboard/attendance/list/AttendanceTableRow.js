import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton,
  MenuItem,
  Popover,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
// utils
import { fDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

AttendanceTableRow.propTypes = {
  row: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewDetails: PropTypes.func,
};

export default function AttendanceTableRow({ row, onEdit, onDelete, onViewDetails }) {
  const [openPopover, setOpenPopover] = useState(null);
  const {
    employeeName,
    employeeId,
    date,
    clockIn,
    clockOut,
    totalHours,
    overtime,
    status,
    isLate,
    clockInLocation,
    clockInIp,
  } = row;

  const getStatusColor = () => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'half_day':
        return 'warning';
      case 'on_leave':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack>
          <Typography variant="subtitle2">{employeeName}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {employeeId}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{fDate(date)}</TableCell>

      <TableCell align="left">
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2">{clockIn}</Typography>
          {isLate && (
            <Chip
              label="Late"
              size="small"
              color="error"
              sx={{ height: 20, fontSize: '0.65rem' }}
            />
          )}
        </Stack>
      </TableCell>

      <TableCell align="left">{clockOut}</TableCell>

      <TableCell align="left">
        <Stack>
          {clockInLocation && (
            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
              <Iconify icon="eva:pin-fill" width={14} sx={{ mr: 0.5, color: 'text.secondary' }} />
              {clockInLocation}
            </Typography>
          )}
          {clockInIp && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              IP: {clockInIp}
            </Typography>
          )}
          {!clockInLocation && !clockInIp && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              -
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Typography variant="subtitle2">{totalHours.toFixed(2)}h</Typography>
      </TableCell>

      <TableCell align="center">
        {overtime > 0 ? (
          <Chip
            label={`${overtime.toFixed(2)}h`}
            color="success"
            size="small"
            icon={<Iconify icon="eva:clock-fill" width={16} />}
          />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            -
          </Typography>
        )}
      </TableCell>

      <TableCell align="center">
        <Label variant="soft" color={getStatusColor()} sx={{ textTransform: 'capitalize' }}>
          {status.replace('_', ' ')}
        </Label>
      </TableCell>

      <TableCell align="right">
        <IconButton onClick={(e) => setOpenPopover(e.currentTarget)}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={() => setOpenPopover(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            onViewDetails && onViewDetails(row.id);
            setOpenPopover(null);
          }}
        >
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          View Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEdit && onEdit(row.id);
            setOpenPopover(null);
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Regularize
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete && onDelete(row.id);
            setOpenPopover(null);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </TableRow>
  );
}

