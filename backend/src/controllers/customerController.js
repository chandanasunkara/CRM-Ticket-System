const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');
const User = require('../models/Users');
const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin/Agent
exports.getCustomers = asyncHandler(async (req, res, next) => {
  // If user is an agent, only show assigned customers
  if (req.user.role === 'agent') {
    req.query.assignedAgent = req.user.id;
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'assignedAgent',
      select: 'name email'
    });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure logged in user is customer owner, assigned agent, or admin
  if (
    req.user.role === 'customer' && 
    customer.user._id.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to access this customer profile`, 403)
    );
  }

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private/Admin
exports.createCustomer = asyncHandler(async (req, res, next) => {
  // Check if user exists
  const user = await User.findById(req.body.user);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.body.user}`, 404)
    );
  }

  // Check if customer already exists for this user
  const existingCustomer = await Customer.findOne({ user: req.body.user });

  if (existingCustomer) {
    return next(
      new ErrorResponse(`Customer profile already exists for this user`, 400)
    );
  }

  const customer = await Customer.create(req.body);

  res.status(201).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private/Admin/Agent
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure logged in user is assigned agent or admin
  if (
    req.user.role === 'agent' && 
    customer.assignedAgent && 
    customer.assignedAgent.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to update this customer profile`, 403)
    );
  }

  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: customer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  await customer.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get customer tickets
// @route   GET /api/customers/:id/tickets
// @access  Private
exports.getCustomerTickets = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure logged in user is customer owner, assigned agent, or admin
  if (
    req.user.role === 'customer' && 
    customer.user.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(`Not authorized to access this customer's tickets`, 403)
    );
  }

  const tickets = await Ticket.find({ customer: customer.user })
    .populate({
      path: 'assignedTo',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
}); 