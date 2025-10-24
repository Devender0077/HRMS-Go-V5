const CalendarEvent = require('../models/CalendarEvent');
const { Op } = require('sequelize');

// Get all calendar events
const getEvents = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    const userType = user?.userType || 'employee';
    const userId = user?.id;
    
    console.log('=== Fetching Calendar Events ===');
    console.log('User type:', userType, 'User ID:', userId);

    // Get all events first
    const allEvents = await CalendarEvent.findAll({
      order: [['start', 'ASC']],
    });

    console.log('Total events in database:', allEvents.length);

    // Filter events based on visibility and user role
    const filteredEvents = allEvents.filter(event => {
      const visibility = event.visibility || 'Everyone';
      
      // Super Admin and HR Manager can see all events
      if (userType === 'super_admin' || userType === 'hr_manager') {
        return true;
      }
      
      // Filter based on visibility setting
      switch (visibility) {
        case 'Everyone':
          return true;
        case 'HR Only':
          return userType === 'hr' || userType === 'hr_manager' || userType === 'super_admin';
        case 'Managers Only':
          return userType === 'manager' || userType === 'hr_manager' || userType === 'super_admin';
        case 'Private':
          // Only creator can see private events
          return event.created_by === userId;
        default:
          return true;
      }
    });

    console.log('Events after visibility filtering:', filteredEvents.length);

    // Transform to FullCalendar format
    const formattedEvents = filteredEvents.map(event => {
      const formatted = {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
        allDay: event.all_day,
        recurring: event.recurring,
        eventType: event.event_type,
        visibility: event.visibility,
        reminder: event.reminder,
        color: event.color,
        textColor: event.text_color,
      };
      
      console.log(`Event ${event.id}: "${event.title}" | Visibility: ${event.visibility} | All-Day: ${event.all_day}`);
      
      return formatted;
    });

    console.log('Sending', formattedEvents.length, 'events to frontend');
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

// Create new calendar event
const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      location,
      start, 
      end, 
      allDay, 
      recurring,
      eventType,
      visibility,
      reminder,
      color, 
      textColor 
    } = req.body;

    console.log('=== Creating Calendar Event ===');
    console.log('Title:', title);
    console.log('All-day event?', allDay);
    console.log('Start received:', start);
    console.log('End received:', end);
    console.log('Start as Date:', new Date(start));
    console.log('End as Date:', end ? new Date(end) : 'null');

    const event = await CalendarEvent.create({
      title,
      description,
      location,
      start: new Date(start),
      end: end ? new Date(end) : null,
      all_day: allDay || false,
      recurring: recurring || false,
      event_type: eventType || 'Other',
      visibility: visibility || 'Everyone',
      reminder: reminder || 'None',
      color: color || '#1890FF',
      text_color: textColor || '#FFFFFF',
      created_by: req.user?.id || 1, // Default to admin user
    });

    console.log('Event created in database:', {
      id: event.id,
      start: event.start,
      end: event.end,
      all_day: event.all_day
    });

    res.status(201).json({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
      allDay: event.all_day,
      recurring: event.recurring,
      eventType: event.event_type,
      visibility: event.visibility,
      reminder: event.reminder,
      color: event.color,
      textColor: event.text_color,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};

// Update calendar event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      location,
      start, 
      end, 
      allDay, 
      recurring,
      eventType,
      visibility,
      reminder,
      color, 
      textColor 
    } = req.body;

    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    console.log('=== Updating Calendar Event ===');
    console.log('Event ID:', id);
    console.log('All-day event?', allDay);
    console.log('Start received:', start);
    console.log('End received:', end);
    console.log('Current DB values:', {
      start: event.start,
      end: event.end,
      all_day: event.all_day
    });

    await event.update({
      title,
      description,
      location,
      start: new Date(start),
      end: end ? new Date(end) : null,
      all_day: allDay || false,
      recurring: recurring || false,
      event_type: eventType || 'Other',
      visibility: visibility || 'Everyone',
      reminder: reminder || 'None',
      color: color || '#1890FF',
      text_color: textColor || '#FFFFFF',
    });

    console.log('Event updated in database:', {
      start: event.start,
      end: event.end,
      all_day: event.all_day
    });

    res.json({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
      allDay: event.all_day,
      recurring: event.recurring,
      eventType: event.event_type,
      visibility: event.visibility,
      reminder: event.reminder,
      color: event.color,
      textColor: event.text_color,
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
};

// Delete calendar event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
      allDay: event.all_day,
      recurring: event.recurring,
      eventType: event.event_type,
      visibility: event.visibility,
      reminder: event.reminder,
      color: event.color,
      textColor: event.text_color,
    });
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    res.status(500).json({ error: 'Failed to fetch calendar event' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
};
