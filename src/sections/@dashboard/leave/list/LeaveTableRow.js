import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  IconButton,
  Checkbox,
  Button,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
// utils
import { fDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

LeaveTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
};

export default function LeaveTableRow({ row, selected, onSelectRow, onApprove, onReject }) {
  const {
    employeeName,
    employeeId,
    leaveType,
    startDate,
    endDate,
    totalDays,
    reason,
    status,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = (action) => {
    setConfirmAction(action);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setConfirmAction(null);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'approve') {
      onApprove();
    } else if (confirmAction === 'reject') {
      onReject();
    }
    handleCloseConfirm();
    handleClosePopover();
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack>
            <Typography variant="subtitle2">{employeeName}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {employeeId}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{leaveType}</TableCell>

        <TableCell align="left">{fDate(startDate)}</TableCell>

        <TableCell align="left">{fDate(endDate)}</TableCell>

        <TableCell align="center">
          <Typography variant="subtitle2">{totalDays} days</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography
            variant="body2"
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {reason}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color={getStatusColor()} sx={{ textTransform: 'capitalize' }}>
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {status === 'pending' && (
          <>
            <MenuItem
              onClick={() => handleOpenConfirm('approve')}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="eva:checkmark-circle-2-fill" />
              Approve
            </MenuItem>

            <MenuItem onClick={() => handleOpenConfirm('reject')} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:close-circle-fill" />
              Reject
            </MenuItem>
          </>
        )}

        <MenuItem onClick={handleClosePopover}>
          <Iconify icon="eva:eye-fill" />
          View Details
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={confirmAction === 'approve' ? 'Approve Leave' : 'Reject Leave'}
        content={`Are you sure you want to ${confirmAction} this leave application?`}
        action={
          <Button
            variant="contained"
            color={confirmAction === 'approve' ? 'success' : 'error'}
            onClick={handleConfirmAction}
          >
            {confirmAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        }
      />
    </>
  );
}

