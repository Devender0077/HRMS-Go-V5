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

const DEPARTMENT_OPTIONS = [
  'all',
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
];

const STATUS_OPTIONS = ['all', 'active', 'inactive'];

// ----------------------------------------------------------------------

EmployeeTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterDepartment: PropTypes.string,
  filterStatus: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterDepartment: PropTypes.func,
  onFilterStatus: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function EmployeeTableToolbar({
  isFiltered,
  filterName,
  filterDepartment,
  filterStatus,
  onFilterName,
  onFilterDepartment,
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

      <TextField
        fullWidth
        select
        label="Department"
        value={filterDepartment}
        onChange={onFilterDepartment}
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
        {DEPARTMENT_OPTIONS.map((option) => (
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

