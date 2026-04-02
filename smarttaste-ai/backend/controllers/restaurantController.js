const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');

/**
 * @desc    Get all restaurants with filters
 * @route   GET /api/restaurants
 * @access  Public
 */
const getRestaurants = async (req, res) => {
  try {
    const {
      cuisineType,
      priceRange,
      minRating,
      isOpenNow,
      amenities,
      city,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = {};

    if (cuisineType) {
      query.cuisineType = { $in: cuisineType.split(',') };
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (isOpenNow === 'true') {
      query.isOpenNow = true;
    }

    if (amenities) {
      query.amenities = { $all: amenities.split(',') };
    }

    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Pagination
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1, popularityScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: restaurants
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get single restaurant by ID
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Create new restaurant
 * @route   POST /api/restaurants
 * @access  Private/Admin
 */
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private/Admin
 */
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private/Admin
 */
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get restaurant reviews
 * @route   GET /api/restaurants/:id/reviews
 * @access  Public
 */
const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Simulate real-time wait time update
 * @route   GET /api/restaurants/:id/wait-time
 * @access  Public
 */
const getWaitTime = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Simulate realistic wait time variation
    const baseWaitTime = restaurant.currentWaitTime;
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5 minutes
    const simulatedWaitTime = Math.max(0, baseWaitTime + variation);

    // Update busy level based on wait time
    let busyLevel = 'low';
    if (simulatedWaitTime > 15) busyLevel = 'medium';
    if (simulatedWaitTime > 30) busyLevel = 'high';
    if (simulatedWaitTime > 45) busyLevel = 'very-high';

    res.status(200).json({
      success: true,
      data: {
        waitTime: simulatedWaitTime,
        busyLevel,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get wait time error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantReviews,
  getWaitTime
};
