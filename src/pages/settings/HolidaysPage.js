import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Button,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Typography,
  TableRow,
  TableCell,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from '../../components/hook-form';
// services
import holidayService from '../../services/api/holidayService';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Holiday Name', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'region', label: 'Region', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

const HolidaySchema = Yup.object().shape({
  name: Yup.string().required('Holiday name is required'),
  date: Yup.string().required('Date is required'),
  type: Yup.string().required('Type is required'),
  region: Yup.string().required('Region is required'),
});

// ----------------------------------------------------------------------

export default function HolidaysPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const methods = useForm({
    resolver: yupResolver(HolidaySchema),
    defaultValues: {
      name: '',
      date: '',
      type: 'public',
      region: 'global',
      description: '',
      isRecurring: false,
      status: 'active',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fetch holidays
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await holidayService.getAll({
        page: page + 1,
        limit: rowsPerPage,
      });

      if (response.success) {
        setTableData(response.holidays || []);
        setTotalCount(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      enqueueSnackbar('Failed to fetch holidays', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  // Handle add/edit dialog
  const handleOpenDialog = (holiday = null) => {
    if (holiday) {
      setCurrentHoliday(holiday);
      reset({
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        region: holiday.region,
        description: holiday.description || '',
        isRecurring: holiday.is_recurring || holiday.isRecurring || false,
        status: holiday.status,
      });
    } else {
      setCurrentHoliday(null);
      reset({
        name: '',
        date: '',
        type: 'public',
        region: 'global',
        description: '',
        isRecurring: false,
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentHoliday(null);
    reset();
  };

  // Submit holiday
  const onSubmit = async (data) => {
    try {
      let response;
      if (currentHoliday) {
        response = await holidayService.update(currentHoliday.id, data);
      } else {
        response = await holidayService.create(data);
      }

      if (response.success) {
        enqueueSnackbar(response.message || `Holiday ${currentHoliday ? 'updated' : 'created'} successfully!`);
        handleCloseDialog();
        fetchHolidays();
      }
    } catch (error) {
      console.error('Error saving holiday:', error);
      enqueueSnackbar('Failed to save holiday', { variant: 'error' });
    }
  };

  // Delete holiday
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        const response = await holidayService.delete(id);
        if (response.success) {
          enqueueSnackbar('Holiday deleted successfully!');
          fetchHolidays();
        }
      } catch (error) {
        console.error('Error deleting holiday:', error);
        enqueueSnackbar('Failed to delete holiday', { variant: 'error' });
      }
    }
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  const isNotFound = !dataFiltered.length && !loading;

  return (
    <>
      <Helmet>
        <title> Holidays | HRMS Go V5</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Holidays</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => handleOpenDialog()}
          >
            Add Holiday
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <HolidayTableRow
                        key={row.id}
                        row={row}
                        onEditRow={() => handleOpenDialog(row)}
                        onDeleteRow={() => handleDelete(row.id)}
                      />
                    ))}

                  <TableEmptyRows height={72} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePaginationCustom
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Add/Edit Holiday Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{currentHoliday ? 'Edit Holiday' : 'Add Holiday'}</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <RHFTextField name="name" label="Holiday Name" placeholder="e.g., Christmas, Diwali" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFSelect name="type" label="Type">
                  <MenuItem value="public">Public Holiday</MenuItem>
                  <MenuItem value="optional">Optional Holiday</MenuItem>
                  <MenuItem value="company">Company Holiday</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFSelect name="region" label="Region">
                  <MenuItem value="india">India</MenuItem>
                  <MenuItem value="usa">USA</MenuItem>
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFSelect name="status" label="Status">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </RHFSelect>
              </Grid>
              <Grid item xs={12}>
                <RHFTextField name="description" label="Description" multiline rows={3} placeholder="Holiday description..." />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentHoliday ? 'Update' : 'Create'}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

function HolidayTableRow({ row, onEditRow, onDeleteRow }) {
  return (
    <TableRow hover>
      <TableCell>{row.name}</TableCell>
      <TableCell>{fDate(row.date)}</TableCell>
      <TableCell>
        <Chip
          label={row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : 'N/A'}
          size="small"
          color={
            row.type === 'public' ? 'error' :
            row.type === 'optional' ? 'warning' :
            row.type === 'company' ? 'primary' : 'default'
          }
        />
      </TableCell>
      <TableCell>
        <Chip
          label={row.region ? row.region.toUpperCase() : 'N/A'}
          size="small"
          variant="outlined"
          color={row.region === 'india' ? 'success' : row.region === 'usa' ? 'info' : 'default'}
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'active' ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <IconButton onClick={onEditRow} color="primary">
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton onClick={onDeleteRow} color="error">
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}


