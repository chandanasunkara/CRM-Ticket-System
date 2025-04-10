const express = require('express');
const router = express.Router();
const { 
  getCustomers, 
  getCustomer, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  getCustomerTickets
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication to all routes
router.use(protect);

// Customer routes
router.route('/')
  .get(authorize('admin', 'agent'), getCustomers)
  .post(authorize('admin'), createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(authorize('admin', 'agent'), updateCustomer)
  .delete(authorize('admin'), deleteCustomer);

// Get customer tickets
router.route('/:id/tickets')
  .get(getCustomerTickets);

module.exports = router; 