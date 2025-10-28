import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'];

const TYPE_OPTIONS = [
  'all',
  'Annual Leave',
  'Sick Leave',
  'Casual Leave',
  'Maternity Leave',
  'Paternity Leave',
];

// ----------------------------------------------------------------------

LeaveTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterStatus: PropTypes.string,
  filterType: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterStatus: PropTypes.func,
  onFilterType: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function LeaveTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  filterType,
  onFilterName,
  onFilterStatus,
  onFilterType,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search employee..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        label="Leave Type"
        value={filterType}
        onChange={onFilterType}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          minWidth: 200,
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {TYPE_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Status"
        value={filterStatus}
        onChange={onFilterStatus}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          minWidth: 160,
          maxWidth: { sm: 200 },
          textTransform: 'capitalize',
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}

