import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  events: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // GET EVENTS (with data) - Used by calendar page to load events from database
    getEvents(state, action) {
      state.isLoading = false;
      if (action.payload && Array.isArray(action.payload)) {
        state.events = action.payload;
      } else if (action.payload === undefined || action.payload === null) {
        state.events = [];
      }
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },
    
    // CREATE EVENT (direct action for calendar service)
    createEvent(state, action) {
      if (action.payload) {
        // Create new array to ensure React detects the change
        state.events = [...state.events, action.payload];
        state.openModal = false;
        state.selectedRange = null;
      }
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
    },
    
    // UPDATE EVENT (direct action for calendar service)
    updateEvent(state, action) {
      const { id, data } = action.payload;
      // Create a new array to ensure React detects the change
      state.events = state.events.map((event) => {
        if (String(event.id) === String(id)) {
          return { ...event, ...data, id: event.id };
        }
        return event;
      });
      state.openModal = false;
      state.selectedEventId = null;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event.id !== eventId);
    },
    
    // DELETE EVENT (direct action for calendar service)
    deleteEvent(state, action) {
      const eventId = action.payload;
      // Filter creates new array, ensuring React detects the change
      state.events = state.events.filter((event) => String(event.id) !== String(eventId));
      state.openModal = false;
      state.selectedEventId = null;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.openModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.openModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    onOpenModal(state) {
      state.openModal = true;
    },

    // CLOSE MODAL
    onCloseModal(state) {
      state.openModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions - Export both direct actions and thunks
export const { 
  onOpenModal, 
  onCloseModal, 
  selectEvent, 
  selectRange,
  getEvents: setEvents,
  createEvent: addEvent,
  updateEvent: modifyEvent,
  deleteEvent: removeEvent,
} = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/new', newEvent);
      dispatch(slice.actions.createEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, event) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/calendar/events/update', {
        eventId,
        event,
      });
      dispatch(slice.actions.updateEventSuccess(response.data.event));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/calendar/events/delete', { eventId });
      dispatch(slice.actions.deleteEventSuccess(eventId));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
