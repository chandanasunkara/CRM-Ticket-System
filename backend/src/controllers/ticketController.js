const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over and remove fields
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Ticket.find(JSON.parse(queryStr));

  // Add role-based filtering
  if (req.user.role === 'customer') {
    // Customers can only see their own tickets
    query = query.find({ customer: req.user.id });
  } else if (req.user.role === 'agent') {
    // Agents can see tickets assigned to them or unassigned
    query = query.find({
      $or: [
        { assignedTo: req.user.id },
        { assignedTo: { $exists: false } },
        { assignedTo: null }
      ]
    });
  }
  // Admins can see all tickets

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Ticket.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate
  query = query.populate({
    path: 'customer',
    select: 'name email'
  }).populate({
    path: 'assignedTo',
    select: 'name email'
  }).populate({
    path: 'comments.user',
    select: 'name email role'
  });

  // Executing query
  const tickets = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: tickets.length,
    pagination,
    data: tickets
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