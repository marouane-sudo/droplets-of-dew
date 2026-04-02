const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantReviews,
  getWaitTime
} = require('../controllers/restaurantController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for personalization)
router.route('/')
  .get(optionalAuth, getRestaurants)
  .post(protect, createRestaurant);

router.route('/:id')
  .get(getRestaurant)
  .put(protect, updateRestaurant)
  .delete(protect, deleteRestaurant);

// Reviews route
router.get('/:id/reviews', getRestaurantReviews);

// Real-time wait time
router.get('/:id/wait-time', getWaitTime);

module.exports = router;
