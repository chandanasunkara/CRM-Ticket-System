const User = require('../models/Users');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure admin cannot delete themselves
  if (user._id.toString() === req.user.id) {
    return next(
      new ErrorResponse(`Admin cannot delete themselves`, 400)
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Assign agent to client
// @route   POST /api/users/assign-agent
// @access  Private
exports.assignAgent = asyncHandler(async (req, res, next) => {
  const { agentEmail } = req.body;
  const clientId = req.user.id;

  // Find the agent by email
  const agent = await User.findOne({ email: agentEmail, role: 'agent' });
  if (!agent) {
    return next(new ErrorResponse('Agent not found', 404));
  }

  // Find the client
  const client = await User.findById(clientId);
  if (!client) {
    return next(new ErrorResponse('Client not found', 404));
  }

  // Add the agent to the client's assignedAgents array if not already there
  if (!client.assignedAgents.includes(agent._id)) {
    client.assignedAgents.push(agent._id);
    await client.save();
  }

  res.status(200).json({
    success: true,
    data: agent
  });
});

// @desc    Get client's assigned agents
// @route   GET /api/users/agents
// @access  Private
exports.getAssignedAgents = asyncHandler(async (req, res, next) => {
  const clientId = req.user.id;

  const client = await User.findById(clientId).populate('assignedAgents');
  if (!client) {
    return next(new ErrorResponse('Client not found', 404));
  }

  res.status(200).json({
    success: true,
    data: client.assignedAgents
  });
}); 