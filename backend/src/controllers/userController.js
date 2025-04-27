const User = require('../models/Users');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');
const Invitation = require('../models/Invitation');
const { sendEmail } = require('../util/sendEmails');

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
exports.assignAgent = async (req, res) => {
  try {
    const { agentEmail, clientId } = req.body;

    // Find agent by email
    const agent = await User.findOne({ email: agentEmail, role: 'agent' });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Find client
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      client: clientId,
      agent: agent._id
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent to this agent' });
    }

    // Create new invitation
    const invitation = await Invitation.create({
      client: clientId,
      agent: agent._id
    });

    // Send invitation email
    await sendEmail({
      to: agent.email,
      subject: 'New Client Invitation',
      text: `You have been invited to work with ${client.companyName}. Please check your dashboard to accept or reject this invitation.`
    });

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation
    });
  } catch (error) {
    console.error('Error assigning agent:', error);
    res.status(500).json({ message: 'Error assigning agent', error: error.message });
  }
};

// Add new function to handle invitation responses
exports.handleInvitation = async (req, res) => {
  try {
    const { invitationId, action } = req.body;
    const agentId = req.user._id;

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.agent.toString() !== agentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to handle this invitation' });
    }

    if (action === 'accept') {
      // Add agent to client's assignedAgents
      await User.findByIdAndUpdate(
        invitation.client,
        { $addToSet: { assignedAgents: agentId } }
      );
      invitation.status = 'accepted';
    } else if (action === 'reject') {
      invitation.status = 'rejected';
    }

    await invitation.save();

    res.status(200).json({
      message: `Invitation ${action}ed successfully`,
      invitation
    });
  } catch (error) {
    console.error('Error handling invitation:', error);
    res.status(500).json({ message: 'Error handling invitation', error: error.message });
  }
};

// Add function to get agent's invitations
exports.getAgentInvitations = async (req, res) => {
  try {
    const agentId = req.user._id;
    const invitations = await Invitation.find({ agent: agentId })
      .populate('client', 'companyName email')
      .sort({ createdAt: -1 });

    res.status(200).json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ message: 'Error fetching invitations', error: error.message });
  }
};

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