const mongoose = require('mongoose');

/**
 * Order Schema
 * Tracks user orders with items, status, and calorie information
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  
  // Order Items
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant.menu'
    },
    name: String,
    quantity: {
      type: Number,
      default: 1
    },
    price: Number,
    calories: Number,
    specialInstructions: String
  }],
  
  // Pricing
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  total: Number,
  
  // Delivery/Pickup Info
  orderType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine-in'],
    default: 'delivery'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'on-the-way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'paypal', 'cash'],
    default: 'credit-card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Additional Info
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
}, {
  timestamps: true
});

// Calculate total calories in the order
orderSchema.methods.calculateTotalCalories = function() {
  return this.items.reduce((total, item) => {
    return total + (item.calories * item.quantity);
  }, 0);
};

// Calculate order totals
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    this.tax = this.subtotal * 0.08; // 8% tax
    this.deliveryFee = this.orderType === 'delivery' ? 5.99 : 0;
    this.total = this.subtotal + this.tax + this.deliveryFee;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
