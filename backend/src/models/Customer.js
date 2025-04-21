const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  subscriptionType: {
    type: String,
    enum: ['free', 'basic', 'professional', 'enterprise'],
    default: 'free'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'pending', 'canceled', 'expired'],
    default: 'active'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  customerSince: {
    type: Date,
    default: Date.now
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual to get all tickets associated with this customer
CustomerSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: 'user',
  foreignField: 'customer'
});

// Index for better performance
CustomerSchema.index({ user: 1 });
CustomerSchema.index({ company: 1 });
CustomerSchema.index({ subscriptionType: 1 });
CustomerSchema.index({ assignedAgent: 1 });

module.exports = mongoose.model('Customer', CustomerSchema); 