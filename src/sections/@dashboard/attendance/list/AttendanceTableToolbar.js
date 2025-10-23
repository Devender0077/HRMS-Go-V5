import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  InputAdornment,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'present', 'absent', 'half_day', 'on_leave'];

// ----------------------------------------------------------------------

AttendanceTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterDate: PropTypes.object,
  filterStatus: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterDate: PropTypes.func,
  onFilterStatus: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function AttendanceTableToolbar({
  isFiltered,
  filterName,
  filterDate,
  filterStatus,
  onFilterName,
  onFilterDate,
  onFilterStatus,
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

      <DatePicker
        label="Date"
        value={filterDate}
        onChange={onFilterDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { sm: 240 },
            }}
          />
        )}
      />

      <TextField
        fullWidth
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
          maxWidth: { sm: 240 },
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
            {option.replace('_', ' ')}
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

