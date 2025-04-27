const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  assignAgent,
  getAssignedAgents
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/Users');

// Apply protection to all routes
router.use(protect);

// Agent assignment routes - these should be accessible to customers
router.post('/assign-agent', assignAgent);
router.get('/agents', getAssignedAgents);

// Routes that only admins can access
router.route('/')
  .get(authorize('admin'), advancedResults(User), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router; 