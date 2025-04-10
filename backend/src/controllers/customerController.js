const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin/Agent
exports.getCustomers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Customer.find(JSON.parse(queryStr));

  // If user is an agent, only show assigned customers
  if (req.user.role === 'agent') {
    query = query.find({ assignedAgent: req.user.id });
  }

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
  const total = await Customer.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate
  query = query.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'assignedAgent',
    select: 'name email'
  });

  // Executing query
  const customers = await query;

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
    count: customers.length,
    pagination,
    data: customers
  });
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