const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores user reviews and ratings for restaurants
 */
const reviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Rating
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Review Content
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Specific Ratings
  foodQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  service: {
    type: Number,
    min: 1,
    max: 5
  },
  atmosphere: {
    type: Number,
    min: 1,
    max: 5
  },
  valueForMoney: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Media
  images: [String],
  
  // Helpful votes
  helpfulVotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Order reference (if review is from an order)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from same user for same restaurant
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

// Update restaurant rating when a review is saved
reviewSchema.post('save', async function() {
  const Restaurant = mongoose.model('Restaurant');
  const restaurant = await Restaurant.findById(this.restaurant);
  if (restaurant) {
    await restaurant.calculateAverageRating();
  }
});

// Update restaurant rating when a review is removed
reviewSchema.post('remove', async function() {
  const Restaurant = mongoose.model('Restaurant');
  const restaurant = await Restaurant.findById(this.restaurant);
  if (restaurant) {
    await restaurant.calculateAverageRating();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
