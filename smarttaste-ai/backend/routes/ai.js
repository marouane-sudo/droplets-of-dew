const express = require('express');
const router = express.Router();
const {
  getRecommendation,
  analyzeVoiceInput,
  chatWithAI
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes are protected
router.post('/recommend', protect, getRecommendation);
router.post('/voice-analyze', protect, analyzeVoiceInput);
router.post('/chat', protect, chatWithAI);

module.exports = router;
