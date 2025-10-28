import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Dialog, Grid, Stack, Typography, Box, Chip, Avatar, IconButton } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { useAuthContext } from '../../auth/useAuthContext';
import {
  setEvents,
  addEvent,
  modifyEvent,
  removeEvent,
  selectEvent,
  selectRange,
  onOpenModal,
  onCloseModal,
} from '../../redux/slices/calendar';
import { calendarService } from '../../services/api/calendarService';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  CalendarFilterDrawer,
} from '../../sections/@dashboard/calendar';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

export default function CalendarPage() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const { events, openModal, selectedRange, selectedEventId } = useSelector(
    (state) => state.calendar
  );

  // For dropdown menu on event click
  // Removed unused dropdown state
  const [modalMode, setModalMode] = useState('edit'); // 'edit' or 'view'

  // Find selected event from events array
  const selectedEvent = selectedEventId 
    ? events.find((event) => String(event.id) === String(selectedEventId))
    : null;

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [openFilter, setOpenFilter] = useState(false);

  const [filterEventColor, setFilterEventColor] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([
    'Meeting', 'Appointment', 'Conference', 'Workshop', 'Training', 'Other'
  ]);

  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  useEffect(() => {
    // Load events from database
    const loadEvents = async () => {
      try {
        const eventsData = await calendarService.getEvents();
        console.log('Loaded events from database:', eventsData);
        if (eventsData && Array.isArray(eventsData)) {
          dispatch(setEvents(eventsData));
        }
      } catch (error) {
        console.error('Error loading calendar events:', error);
        enqueueSnackbar('Error loading events from database', { variant: 'error' });
        // Don't load mock data on error, just show empty calendar
        dispatch(setEvents([]));
      }
    };
    
    loadEvents();
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(
      selectRange({
        start: arg.start,
        end: arg.end,
      })
    );
  };

  const handleSelectEvent = (arg) => {
    const eventId = arg.event.id;
    setModalMode('view');
    dispatch(selectEvent(eventId));
    dispatch(onOpenModal());
  };

  const handleCloseEventMenu = () => {
  };

    // Removed unused dropdown handlers

  const handleResizeEvent = async ({ event }) => {
    try {
      const updatedEvent = await calendarService.updateEvent(event.id, {
        allDay: event.allDay,
        start: event.start,
        end: event.end,
      });
      
      // Reload all events to ensure calendar reflects the change
      const refreshedEvents = await calendarService.getEvents();
      dispatch(setEvents(refreshedEvents));
      
      enqueueSnackbar('Event time updated');
    } catch (error) {
      console.error('Error resizing event:', error);
      enqueueSnackbar('Error updating event', { variant: 'error' });
    }
  };

  const handleDropEvent = async ({ event }) => {
    try {
      const updatedEvent = await calendarService.updateEvent(event.id, {
        allDay: event.allDay,
        start: event.start,
        end: event.end,
      });
      
      // Reload all events to ensure calendar reflects the change
      const refreshedEvents = await calendarService.getEvents();
      dispatch(setEvents(refreshedEvents));
      
      enqueueSnackbar('Event moved');
    } catch (error) {
      console.error('Error moving event:', error);
      enqueueSnackbar('Error updating event', { variant: 'error' });
    }
  };

  const handleOpenModal = () => {
    setModalMode('edit');
    dispatch(onOpenModal());
  };

  const handleCloseModal = () => {
    console.log('Closing modal, selected event was:', selectedEventId);
    dispatch(onCloseModal());
  };

  const handleCreateUpdateEvent = async (newEvent) => {
    try {
      if (selectedEventId) {
        // Update existing event
        const updatedEvent = await calendarService.updateEvent(selectedEventId, newEvent);
        console.log('Event updated:', updatedEvent);
        
        // Update Redux state
        dispatch(modifyEvent({ id: selectedEventId, data: updatedEvent }));
        
        // Force calendar to refresh by reloading all events
        const refreshedEvents = await calendarService.getEvents();
        dispatch(setEvents(refreshedEvents));
        
        enqueueSnackbar('Event updated successfully!');
      } else {
        // Create new event, add createdBy from logged in user
        const eventWithCreator = {
          ...newEvent,
          createdBy: user?.displayName || user?.name || 'Unknown',
        };
        const createdEvent = await calendarService.createEvent(eventWithCreator);
        console.log('Event created:', createdEvent);
        dispatch(addEvent(createdEvent));
        enqueueSnackbar('Event created successfully!');
      }
      // Close modal after successful save
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
      enqueueSnackbar('Error saving event. Please try again.', { variant: 'error' });
    }
  };

  const handleDeleteEvent = async () => {
    try {
      if (selectedEventId) {
        await calendarService.deleteEvent(selectedEventId);
        console.log('Event deleted:', selectedEventId);
        
        // Remove from Redux
        dispatch(removeEvent(selectedEventId));
        
        // Reload events to ensure calendar is in sync
        const refreshedEvents = await calendarService.getEvents();
        dispatch(setEvents(refreshedEvents));
        
        handleCloseModal();
        enqueueSnackbar('Event deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      enqueueSnackbar('Error deleting event. Please try again.', { variant: 'error' });
    }
  };

  const handleFilterEventColor = (eventColor) => {
    const checked = filterEventColor.includes(eventColor)
      ? filterEventColor.filter((value) => value !== eventColor)
      : [...filterEventColor, eventColor];

    setFilterEventColor(checked);
  };

  // Transform events for FullCalendar display
  // For all-day events, FullCalendar uses exclusive end dates
  // Database stores inclusive dates (what user selected)
  // We add +1 day to end ONLY for FullCalendar rendering
  const eventsForCalendar = events.map(event => {
    if (event.allDay && event.end) {
      const endDate = new Date(event.end);
      endDate.setDate(endDate.getDate() + 1); // Add 1 day for FullCalendar exclusive end
      return {
        ...event,
        end: endDate.toISOString(),
      };
    }
    return event;
  });

  // For filtering and sidebar, use original events (no date adjustment)
  const dataFiltered = applyFilter({
    inputData: events, // Use original events for sidebar
    filterEventColor,
    filterEventTypes: selectedCategories,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
  });

  // For calendar rendering, use adjusted events
  const calendarDataFiltered = applyFilter({
    inputData: eventsForCalendar, // Use adjusted events for FullCalendar
    filterEventColor,
    filterEventTypes: selectedCategories,
    filterStartDate: picker.startDate,
    filterEndDate: picker.endDate,
    isError: !!picker.isError,
  });

  return (
    <>
      <Helmet>
        <title> Calendar | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Calendar"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Calendar',
            },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenModal}
            >
              New Event
            </Button>
          }
        />

        <Grid container spacing={3}>
          {/* Events & Schedules - Left Side (Like Screenshot) */}
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 3, height: 760, overflowY: 'auto' }}>
              {/* Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Events & Schedules
                </Typography>
              </Stack>

              {/* View All Event Types Checkbox */}
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === 6}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories(['Meeting', 'Appointment', 'Conference', 'Workshop', 'Training', 'Other']);
                      } else {
                        setSelectedCategories([]);
                      }
                    }}
                    style={{ accentColor: '#1890FF' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    View All Event Types
                  </Typography>
                </Stack>
              </Box>

              {/* Event Type Filters */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Event Types
                </Typography>
                <Stack spacing={1}>
                  {[
                    { name: 'Meeting', color: '#1890FF' },
                    { name: 'Appointment', color: '#00AB55' },
                    { name: 'Conference', color: '#54D62C' },
                    { name: 'Workshop', color: '#FFC107' },
                    { name: 'Training', color: '#FF4842' },
                    { name: 'Other', color: '#04297A' },
                  ].map((category) => (
                    <Stack key={category.name} direction="row" alignItems="center" spacing={1}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.name]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(cat => cat !== category.name));
                          }
                        }}
                        style={{ accentColor: category.color }}
                      />
                      <Typography variant="body2">{category.name}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              {/* Events List */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
                  UPCOMING EVENTS
                </Typography>
                <Stack spacing={2}>
                  {dataFiltered.slice(0, 5).map((event) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                      onClick={() => {
                        setModalMode('view');
                        dispatch(selectEvent(event.id));
                        dispatch(onOpenModal());
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Date Block */}
                        <Box
                          sx={{
                            minWidth: 60,
                            height: 80,
                            borderRadius: 1,
                            bgcolor: event.color || '#1890FF',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            color: 'white',
                            position: 'relative',
                            py: 1.2,
                          }}
                        >
                          <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.2 }}>
                            {new Date(event.start).getDate()}
                          </Typography>
                          <Typography variant="caption" sx={{ mb: event.createdBy ? 1.2 : 0 }}>
                            {new Date(event.start).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                          </Typography>
                          {event.createdBy && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 6,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 'auto',
                                minWidth: 40,
                                height: 24,
                                borderRadius: 6,
                                bgcolor: event.color || '#1890FF',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.675rem',
                                fontWeight: 500,
                                boxShadow: 1,
                                px: 1,
                                letterSpacing: 0.1,
                              }}
                            >
                              {event.createdBy}
                            </Box>
                          )}
                        </Box>

                        {/* Event Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" fontWeight="bold" noWrap>
                            {event.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {event.allDay ? (
                              'All Day Event'
                            ) : (
                              <>
                                {new Date(event.start).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit',
                                  hour12: true 
                                })} - {new Date(event.end || event.start).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </>
                            )}
                            {event.location && `, ${event.location}`}
                          </Typography>
                          {event.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              {event.description.length > 50 
                                ? `${event.description.substring(0, 50)}...` 
                                : event.description
                              }
                            </Typography>
                          )}
                          
                          {/* Event Type Badge */}
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              bgcolor: event.color || '#1890FF',
                              color: 'white',
                              borderRadius: 1,
                              px: 1,
                              height: 24,
                              fontSize: '0.75rem',
                              minWidth: 0,
                            }}>
                              <span>{event.eventType || 'Event'}</span>
                            </Box>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* Calendar - Right Side */}
          <Grid item xs={12} md={9}>
            <Card>
              <StyledCalendar>
                <CalendarToolbar
                  date={date}
                  view={view}
                  onNextDate={handleClickDateNext}
                  onPrevDate={handleClickDatePrev}
                  onToday={handleClickToday}
                  onChangeView={handleChangeView}
                  onOpenFilter={handleOpenFilter}
                />
                <FullCalendar
              weekends
              editable
              droppable
              selectable
              allDayMaintainDuration
              eventResizableFromStart
              events={calendarDataFiltered}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              select={handleSelectRange}
              eventDrop={handleDropEvent}
              eventClick={handleSelectEvent}
              eventResize={handleResizeEvent}
              height={isDesktop ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
              </StyledCalendar>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog fullWidth maxWidth="md" open={openModal} onClose={handleCloseModal}>
        {modalMode === 'edit' ? (
          <CalendarForm
            event={selectedEvent}
            range={selectedRange}
            onCancel={handleCloseModal}
            onCreateUpdateEvent={handleCreateUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            colorOptions={COLOR_OPTIONS}
          />
        ) : (
          <Box sx={{ p: 3, position: 'relative' }}>
            <DialogTitle sx={{ pr: 6 }}>
              View Event
              <IconButton
                aria-label="Edit"
                onClick={() => setModalMode('edit')}
                sx={{ position: 'absolute', right: 16, top: 16 }}
              >
                <Iconify icon="eva:edit-2-outline" />
              </IconButton>
            </DialogTitle>
            <Stack spacing={2}>
              <Typography variant="h6">{selectedEvent?.title}</Typography>
              <Typography variant="body2">{selectedEvent?.description}</Typography>
              <Typography variant="body2">
                {selectedEvent?.allDay ? 'All Day' : `${new Date(selectedEvent?.start).toLocaleString()} - ${new Date(selectedEvent?.end).toLocaleString()}`}
              </Typography>
              <Typography variant="body2">Type: {selectedEvent?.eventType}</Typography>
              {selectedEvent?.location && <Typography variant="body2">Location: {selectedEvent.location}</Typography>}
              <Button variant="contained" onClick={handleCloseModal}>Close</Button>
            </Stack>
          </Box>
        )}
      </Dialog>

      <CalendarFilterDrawer
        events={events}
        picker={picker}
        open={openFilter}
        onClose={handleCloseFilter}
        colorOptions={COLOR_OPTIONS}
        filterEventColor={filterEventColor}
        onFilterEventColor={handleFilterEventColor}
        onResetFilter={() => {
          const { setStartDate, setEndDate } = picker;
          setFilterEventColor([]);
          if (setStartDate && setEndDate) {
            setStartDate(null);
            setEndDate(null);
          }
        }}
        onSelectEvent={(eventId) => {
          if (eventId) {
            setModalMode('view');
            dispatch(selectEvent(eventId));
            dispatch(onOpenModal());
          }
        }}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filterEventColor, filterEventTypes, filterStartDate, filterEndDate, isError }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  // Filter by event type
  if (filterEventTypes && filterEventTypes.length > 0) {
    inputData = inputData.filter((event) => filterEventTypes.includes(event.eventType || 'Other'));
  }

  if (filterEventColor.length) {
    inputData = inputData.filter((event) => filterEventColor.includes(event.textColor));
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (event) =>
        fTimestamp(event.start) >= fTimestamp(filterStartDate) &&
        fTimestamp(event.end) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
