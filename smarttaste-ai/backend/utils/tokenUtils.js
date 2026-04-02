const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Send Token Response
 * Creates token and sends it in response with user data
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = generateToken(user._id);

  // Prepare user data (exclude sensitive information)
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    preferences: user.preferences,
    points: user.points,
    level: user.level,
    badges: user.badges,
    friends: user.friends,
    totalOrders: user.totalOrders,
    createdAt: user.createdAt
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

module.exports = { generateToken, sendTokenResponse };
