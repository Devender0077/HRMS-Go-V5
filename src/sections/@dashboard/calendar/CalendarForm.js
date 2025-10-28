import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useEffect } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { 
  Box, 
  Stack, 
  Button, 
  Tooltip, 
  TextField, 
  IconButton, 
  DialogActions, 
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker, MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../components/iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import FormProvider, { RHFTextField, RHFSwitch, RHFSelect } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const initialEvent = {
    title: '',
    description: '',
    location: '',
    color: '#1890FF',
    textColor: '#FFFFFF',
    allDay: false,
    recurring: false,
    eventType: 'Other',
    visibility: 'Everyone',
    reminder: 'None',
    start: range ? new Date(range.start).toISOString() : new Date().toISOString(),
    end: range ? new Date(range.end).toISOString() : new Date().toISOString(),
  };

  if (event) {
    // Event exists - merge with initial values
    console.log('=== Loading Event for Editing ===');
    console.log('Event data from database:', event);
    
    // Load dates exactly as stored in database (no adjustment)
    const startDate = event.start ? new Date(event.start) : new Date();
    const endDate = event.end ? new Date(event.end) : new Date();
    
    console.log('Form will show start:', startDate.toISOString());
    console.log('Form will show end:', endDate.toISOString());
    
    return merge({}, initialEvent, {
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      color: event.color || '#1890FF',
      textColor: event.textColor || '#FFFFFF',
      allDay: event.allDay || false,
      recurring: event.recurring || false,
      eventType: event.eventType || 'Other',
      visibility: event.visibility || 'Everyone',
      reminder: event.reminder || 'None',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });
  }
  
  if (range) {
    // Range selection - use range dates
    console.log('=== Date Range Selected ===');
    console.log('Range start:', range.start);
    console.log('Range end:', range.end);
    
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);
    
    // FullCalendar gives us the range as-is, use it directly
    console.log('Form will show start:', rangeStart.toISOString());
    console.log('Form will show end:', rangeEnd.toISOString());
    
    return merge({}, initialEvent, {
      start: rangeStart.toISOString(),
      end: rangeEnd.toISOString(),
      allDay: true, // Range selections are typically all-day
    });
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarForm({
  event,
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
}) {
  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    description: Yup.string().max(5000),
    location: Yup.string().max(255),
    eventType: Yup.string().required(),
    visibility: Yup.string().required(),
    reminder: Yup.string().required(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Reset form when event changes (important for editing)
  useEffect(() => {
    console.log('Form received event:', event);
    console.log('Form received range:', range);
    if (event || range) {
      reset(getInitialValues(event, range));
    }
  }, [event, range, reset]);

  const onSubmit = async (data) => {
    try {
      // Store EXACTLY what user selects in database (inclusive dates)
      // No adjustment here - database stores user's intention
      const startDate = new Date(data.start).toISOString();
      const endDate = data.end ? new Date(data.end).toISOString() : startDate;

      const newEvent = {
        title: data.title,
        description: data.description,
        location: data.location,
        color: data.color || data.textColor || '#1890FF',
        textColor: data.textColor || '#FFFFFF',
        allDay: data.allDay,
        recurring: data.recurring,
        eventType: data.eventType,
        visibility: data.visibility,
        reminder: data.reminder,
        start: startDate,
        end: endDate,
      };
      
      console.log('=== Event Submission ===');
      console.log('All-day event?', data.allDay);
      console.log('User selected start:', data.start);
      console.log('User selected end:', data.end);
      console.log('Saving to database (as-is):', { start: startDate, end: endDate });
      console.log('Full event data:', newEvent);
      
      await onCreateUpdateEvent(newEvent);
      // Parent component handles modal close now
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError =
    !values.allDay && values.start && values.end
      ? isBefore(new Date(values.end), new Date(values.start))
      : false;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h6">
            {hasEventData ? 'Edit Event' : 'Add New Event'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasEventData ? 'Update your calendar event' : 'Create a new calendar event'}
          </Typography>
        </Stack>

        {/* Creator Info - Show for existing events */}
        {hasEventData && event?.createdBy && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.neutral', borderRadius: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.main',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {event.createdBy.charAt(0).toUpperCase()}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                  Created by
                </Typography>
                <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                  {event.createdBy}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}

        <Stack spacing={3}>
          {/* Event Title */}
          <RHFTextField 
            name="title" 
            label="Event Title" 
            placeholder="Enter event title"
            fullWidth
          />

          {/* All Day Event Toggle */}
          <RHFSwitch 
            name="allDay" 
            label="All Day Event" 
          />

          {/* From Date and Time */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              From
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      onChange={(newValue) => field.onChange(newValue)}
                      label="Start Date"
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Box>
              {!values.allDay && (
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="start"
                    control={control}
                    render={({ field }) => (
                      <MobileTimePicker
                        {...field}
                        onChange={(newValue) => field.onChange(newValue)}
                        label="Start Time"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    )}
                  />
                </Box>
              )}
            </Stack>
          </Box>

          {/* To Date and Time */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              To
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      onChange={(newValue) => field.onChange(newValue)}
                      label="End Date"
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  )}
                />
              </Box>
              {!values.allDay && (
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="end"
                    control={control}
                    render={({ field }) => (
                      <MobileTimePicker
                        {...field}
                        onChange={(newValue) => field.onChange(newValue)}
                        label="End Time"
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    )}
                  />
                </Box>
              )}
            </Stack>
            {isDateError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                End date/time must be after start date/time
              </Typography>
            )}
          </Box>

          {/* Event Type */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Event Type
            </Typography>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <Select {...field} displayEmpty>
                    <MenuItem value="Meeting">Meeting</MenuItem>
                    <MenuItem value="Appointment">Appointment</MenuItem>
                    <MenuItem value="Conference">Conference</MenuItem>
                    <MenuItem value="Workshop">Workshop</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          {/* Color */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Color
            </Typography>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <ColorSinglePicker
                  value={field.value}
                  onChange={field.onChange}
                  colors={colorOptions}
                />
              )}
            />
          </Box>

          {/* Location */}
          <RHFTextField 
            name="location" 
            label="Location" 
            placeholder="Enter event location"
            fullWidth
          />

          {/* Description */}
          <RHFTextField 
            name="description" 
            label="Description" 
            placeholder="Enter event description"
            multiline 
            rows={3}
            fullWidth
          />

          <Divider />

          {/* Recurring Event */}
          <RHFSwitch 
            name="recurring" 
            label="Recurring Event" 
          />

          {/* Reminder */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Reminder
            </Typography>
            <Controller
              name="reminder"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <Select {...field} displayEmpty>
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="5 minutes">5 minutes before</MenuItem>
                    <MenuItem value="15 minutes">15 minutes before</MenuItem>
                    <MenuItem value="30 minutes">30 minutes before</MenuItem>
                    <MenuItem value="1 hour">1 hour before</MenuItem>
                    <MenuItem value="1 day">1 day before</MenuItem>
                    <MenuItem value="1 week">1 week before</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          {/* Event Visibility */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Event Visibility
            </Typography>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <Select {...field} displayEmpty>
                    <MenuItem value="Everyone">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="eva:globe-2-outline" width={20} />
                        <Box>
                          <Typography variant="body2">Everyone</Typography>
                          <Typography variant="caption" color="text.secondary">
                            All employees can see this event
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="Team">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="eva:people-outline" width={20} />
                        <Box>
                          <Typography variant="body2">Team</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Only your team/department can see
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="HR Only">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="eva:briefcase-outline" width={20} />
                        <Box>
                          <Typography variant="body2">HR Only</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Only HR team can see
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="Managers Only">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="eva:star-outline" width={20} />
                        <Box>
                          <Typography variant="body2">Managers Only</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Only managers can see
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="Private">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon="eva:lock-outline" width={20} />
                        <Box>
                          <Typography variant="body2">Private</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Only you can see this event
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </Stack>
      </Box>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent} color="error">
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Update Event' : 'Create Event'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
