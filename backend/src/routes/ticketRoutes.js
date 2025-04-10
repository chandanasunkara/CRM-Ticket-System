const express = require('express');
const router = express.Router();
const { 
  getTickets, 
  getTicket, 
  createTicket, 
  updateTicket, 
  deleteTicket,
  addComment
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Ticket routes
router.route('/')
  .get(getTickets)
  .post(createTicket);

router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(authorize('admin'), deleteTicket);

// Comments route
router.route('/:id/comments')
  .post(addComment);

module.exports = router; 