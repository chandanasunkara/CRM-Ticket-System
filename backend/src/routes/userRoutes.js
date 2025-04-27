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

// Routes that only admins can access
router.route('/')
  .get(authorize('admin'), advancedResults(User), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

// Agent assignment routes
router.post('/assign-agent', assignAgent);
router.get('/agents', getAssignedAgents);

module.exports = router; 