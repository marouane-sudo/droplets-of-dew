const AIService = require('../services/aiService');

/**
 * @desc    Get AI-based food recommendation
 * @route   POST /api/ai/recommend
 * @access  Private
 */
const getRecommendation = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Please provide your current mood' });
    }

    // Get recommendation from AI service
    const recommendation = await AIService.getRecommendation(mood, req.user);

    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Analyze voice input
 * @route   POST /api/ai/voice-analyze
 * @access  Private
 */
const analyzeVoiceInput = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Please provide voice text' });
    }

    // Analyze voice input
    const analysis = await AIService.analyzeVoiceInput(text);

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analyze voice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Chat with AI assistant
 * @route   POST /api/ai/chat
 * @access  Private
 */
const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    // Build conversation context
    let prompt = `You are SmartTaste AI, a friendly restaurant and food assistant. Help users find restaurants, recommend dishes, answer food-related questions, and provide nutrition information.\n\n`;
    
    if (context) {
      prompt += `Context: ${context}\n\n`;
    }
    
    prompt += `User: ${message}\nAssistant:`;

    // If OpenAI is enabled, use it
    if (AIService.isEnabled && AIService.openai) {
      const completion = await AIService.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are SmartTaste AI, a helpful restaurant and food assistant. Provide useful recommendations and answer questions about food, restaurants, nutrition, and dining.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      res.status(200).json({
        success: true,
        data: {
          response: completion.choices[0].message.content,
          source: 'ai'
        }
      });
    } else {
      // Fallback responses
      const fallbackResponses = [
        "I'd love to help you find great food! Try searching by cuisine type or let me know your mood for personalized recommendations.",
        "Based on popular choices, I recommend checking out our top-rated restaurants in your area!",
        "Looking for something specific? You can filter by price, rating, distance, or dietary preferences.",
        "Need calorie information? Check the menu details for each restaurant - we track nutritional info!"
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      res.status(200).json({
        success: true,
        data: {
          response: randomResponse,
          source: 'fallback'
        }
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getRecommendation,
  analyzeVoiceInput,
  chatWithAI
};
