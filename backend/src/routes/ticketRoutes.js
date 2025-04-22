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
const advancedResults = require('../middleware/advancedResults');
const Ticket = require('../models/Ticket');

// Apply authentication to all routes
router.use(protect);

// Ticket routes
router.route('/')
  .get(
    advancedResults(Ticket, [
      { path: 'customer', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'comments.user', select: 'name email role' }
    ]), 
    getTickets
  )
  .post(createTicket);

router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(authorize('admin'), deleteTicket);

// Comments route
router.route('/:id/comments')
  .post(addComment);

module.exports = router; 