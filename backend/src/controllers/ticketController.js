const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const User = require('../models/Users');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = asyncHandler(async (req, res, next) => {
  // Add role-based filtering
  if (req.user.role === 'customer') {
    // Customers can only see their own tickets
    req.query.customer = req.user._id;
  } else if (req.user.role === 'agent') {
    // Agents can only see tickets from their assigned clients
    const agent = await User.findById(req.user._id).populate('clients');
    if (!agent.clients || agent.clients.length === 0) {
      // If agent has no clients, return empty result
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    const clientIds = agent.clients.map(client => client._id);
    req.query.customer = { $in: clientIds };
  }
  // Admins can see all tickets

  // Get ticket stats
  const stats = await Ticket.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format stats
  const formattedStats = {
    total: 0,
    pending: 0,
    open: 0,
    closed: 0
  };

  stats.forEach(stat => {
    formattedStats.total += stat.count;
    formattedStats[stat._id] = stat.count;
  });

  res.status(200).json({
    ...res.advancedResults,
    stats: formattedStats
  });
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate({
      path: 'customer',
      select: 'name email'
    })
    .populate({
      path: 'assignedTo',
      select: 'name email'
    })
    .populate({
      path: 'comments.user',
      select: 'name email role'
    });

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner, assigned agent, or admin
  if (
    req.user.role === 'customer' && 
    ticket.customer._id.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to access this ticket`, 403)
    );
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.customer = req.user.id;

  // Check if customer profile exists, otherwise create one
  if (req.user.role === 'customer') {
    const customerExists = await Customer.findOne({ user: req.user.id });

    if (!customerExists) {
      await Customer.create({
        user: req.user.id,
        // Add more default fields if needed
      });
    }
  }

  const ticket = await Ticket.create(req.body);

  // Add initial comment with the description
  if (req.body.description) {
    ticket.comments.push({
      text: req.body.description,
      user: req.user.id
    });
    await ticket.save();
  }

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = asyncHandler(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner, assigned agent, or admin
  if (
    req.user.role === 'customer' && 
    ticket.customer.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to update this ticket`, 403)
    );
  }

  ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
exports.deleteTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure only admin can delete tickets
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this ticket`, 403)
    );
  }

  await ticket.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner, assigned agent, or admin
  if (
    req.user.role === 'customer' && 
    ticket.customer.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to comment on this ticket`, 403)
    );
  }

  // Add comment
  const comment = {
    text: req.body.text,
    user: req.user.id
  };

  ticket.comments.push(comment);

  // Update ticket status based on who's commenting
  if (req.user.role === 'customer') {
    ticket.status = 'open'; // or another appropriate status
  } else if (req.user.role === 'agent' || req.user.role === 'admin') {
    if (req.body.status) {
      ticket.status = req.body.status;
    } else {
      ticket.status = 'in-progress';
    }
  }

  await ticket.save();

  // Fetch the updated ticket with populated fields
  const updatedTicket = await Ticket.findById(req.params.id)
    .populate({
      path: 'customer',
      select: 'name email'
    })
    .populate({
      path: 'assignedTo',
      select: 'name email'
    })
    .populate({
      path: 'comments.user',
      select: 'name email role'
    });

  res.status(200).json({
    success: true,
    data: updatedTicket
  });
}); 