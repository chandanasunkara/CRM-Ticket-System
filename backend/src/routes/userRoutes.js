const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  assignAgent,
  getAssignedAgents,
  handleInvitation,
  getAgentInvitations,
  getPendingInvitations,
  getAgentClients
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/Users');

// Apply protection to all routes
router.use(protect);

// Agent assignment routes - accessible to customers
router.post('/assign-agent', authorize(['customer', 'admin']), assignAgent);
router.get('/agents', authorize(['customer', 'admin']), getAssignedAgents);
router.get('/pending-invitations', authorize(['customer', 'admin']), getPendingInvitations);

// Agent routes
router.get('/clients', authorize(['agent', 'admin']), getAgentClients);

// Invitation routes
router.post('/invitations/handle', authorize(['agent', 'admin']), handleInvitation);
router.get('/invitations', authorize(['agent', 'admin']), getAgentInvitations);

// Routes that only admins can access
router.route('/')
  .get(authorize('admin'), advancedResults(User), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router; 