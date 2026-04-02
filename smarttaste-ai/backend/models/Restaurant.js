const mongoose = require('mongoose');

/**
 * Restaurant Schema
 * Stores restaurant information including menu, ratings, and wait times
 */
const restaurantSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide a restaurant name'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Contact & Location
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  phone: String,
  email: String,
  website: String,
  
  // Cuisine & Menu
  cuisineType: [{
    type: String,
    enum: ['italian', 'chinese', 'japanese', 'mexican', 'indian', 'american', 'french', 'thai', 'mediterranean', 'other']
  }],
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String, // appetizer, main, dessert, drink
    calories: Number,
    image: String,
    isAvailable: {
      type: Boolean,
      default: true
    },
    dietaryInfo: [String] // vegetarian, vegan, gluten-free, etc.
  }],
  
  // Pricing
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  averageCostForTwo: Number,
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  
  // Operational Info
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  isOpenNow: {
    type: Boolean,
    default: true
  },
  
  // Real-time Info
  currentWaitTime: {
    type: Number, // in minutes
    default: 0
  },
  busyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  
  // Features
  amenities: [String], // wifi, parking, outdoor-seating, delivery, takeaway
  images: [String],
  
  // Popularity
  totalOrders: {
    type: Number,
    default: 0
  },
  popularityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for geospatial queries
restaurantSchema.index({ 'address.coordinates': '2dsphere' });

// Method to calculate average rating from reviews
restaurantSchema.methods.calculateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { restaurant: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.rating = Math.round(stats[0].averageRating * 10) / 10;
    this.numReviews = stats[0].numReviews;
    await this.save();
  }
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
