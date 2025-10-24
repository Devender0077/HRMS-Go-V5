const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} = require('../controllers/calendar.controller');

// Calendar routes
router.get('/', getEvents); // Root endpoint - get all events
router.get('/events', getEvents);
router.post('/events', createEvent);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
