const OpenAI = require('openai');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

/**
 * AI Service for Food Recommendations
 * Uses OpenAI API to provide personalized food recommendations
 */
class AIService {
  constructor() {
    // Initialize OpenAI client if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      this.isEnabled = true;
    } else {
      this.isEnabled = false;
      console.log('⚠️  OpenAI API not configured. Using fallback recommendations.');
    }
  }

  /**
   * Get AI-based food recommendation based on user mood and preferences
   * @param {string} mood - User's current mood (happy, sad, stressed, excited, etc.)
   * @param {Object} user - User object with preferences
   * @returns {Promise<Object>} - Recommendation with restaurant and dish suggestions
   */
  async getRecommendation(mood, user) {
    if (!this.isEnabled) {
      return this.getFallbackRecommendation(mood, user);
    }

    try {
      // Build prompt for OpenAI
      const prompt = this.buildRecommendationPrompt(mood, user);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful food recommendation assistant. Provide personalized restaurant and dish recommendations based on user mood, preferences, and dietary restrictions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const recommendation = JSON.parse(completion.choices[0].message.content);
      
      // Find matching restaurants from database
      const restaurants = await this.findMatchingRestaurants(recommendation.cuisineType, user);
      
      return {
        ...recommendation,
        restaurants,
        source: 'ai'
      };
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      return this.getFallbackRecommendation(mood, user);
    }
  }

  /**
   * Fallback recommendation when OpenAI is not available
   */
  getFallbackRecommendation(mood, user) {
    // Mood-based recommendation logic
    const moodRecommendations = {
      happy: {
        cuisineType: ['italian', 'mediterranean'],
        message: "You're feeling happy! Celebrate with some delicious Italian or Mediterranean cuisine!",
        dishSuggestion: 'Try a fresh pasta or Mediterranean platter'
      },
      sad: {
        cuisineType: ['american', 'italian'],
        message: "Feeling down? Comfort food is here for you! Try some classic American or Italian dishes.",
        dishSuggestion: 'Mac and cheese or pizza always lifts spirits!'
      },
      stressed: {
        cuisineType: ['japanese', 'thai'],
        message: "Stressed out? Calm your mind with soothing Japanese or Thai cuisine.",
        dishSuggestion: 'Sushi or a warm bowl of ramen can be very therapeutic'
      },
      excited: {
        cuisineType: ['mexican', 'indian'],
        message: "Feeling excited? Match that energy with bold Mexican or Indian flavors!",
        dishSuggestion: 'Spicy tacos or flavorful curry will keep the excitement going'
      },
      tired: {
        cuisineType: ['chinese', 'american'],
        message: "Tired? Easy-to-eat Chinese or American comfort food is perfect.",
        dishSuggestion: 'Fried rice or a hearty burger will give you energy'
      }
    };

    const defaultRec = {
      cuisineType: ['mediterranean'],
      message: "Based on your preferences, we recommend trying something new!",
      dishSuggestion: 'Explore our top-rated restaurants'
    };

    const rec = moodRecommendations[mood.toLowerCase()] || defaultRec;

    // Consider user preferences
    if (user && user.preferences) {
      if (user.preferences.favoriteCuisines && user.preferences.favoriteCuisines.length > 0) {
        rec.cuisineType = user.preferences.favoriteCuisines.slice(0, 2);
      }
    }

    return {
      ...rec,
      source: 'fallback',
      restaurants: []
    };
  }

  /**
   * Build prompt for OpenAI API
   */
  buildRecommendationPrompt(mood, user) {
    let prompt = `User mood: ${mood}\n`;
    
    if (user) {
      if (user.preferences) {
        if (user.preferences.dietaryRestrictions?.length > 0) {
          prompt += `Dietary restrictions: ${user.preferences.dietaryRestrictions.join(', ')}\n`;
        }
        if (user.preferences.favoriteCuisines?.length > 0) {
          prompt += `Favorite cuisines: ${user.preferences.favoriteCuisines.join(', ')}\n`;
        }
        if (user.preferences.allergies?.length > 0) {
          prompt += `Allergies: ${user.preferences.allergies.join(', ')}\n`;
        }
        prompt += `Preferred spice level: ${user.preferences.spicyLevel || 'medium'}\n`;
      }
    }

    prompt += '\nPlease provide a JSON response with the following structure:\n';
    prompt += `{
      "cuisineType": ["cuisine1", "cuisine2"],
      "message": "Personalized message to user",
      "dishSuggestion": "Specific dish recommendation",
      "reasoning": "Why this recommendation fits the mood and preferences"
    }`;

    return prompt;
  }

  /**
   * Find restaurants matching the recommended cuisine
   */
  async findMatchingRestaurants(cuisineTypes, user) {
    const query = {
      cuisineType: { $in: cuisineTypes },
      isOpenNow: true
    };

    // Filter by price range if user has preferences
    if (user && user.preferences && user.preferences.priceRange) {
      query.priceRange = user.preferences.priceRange;
    }

    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1, popularityScore: -1 })
      .limit(5)
      .select('name description cuisineType rating priceRange images currentWaitTime');

    return restaurants;
  }

  /**
   * Analyze voice input text and extract intent
   * @param {string} text - Transcribed voice text
   * @returns {Object} - Extracted intent and parameters
   */
  async analyzeVoiceInput(text) {
    if (!this.isEnabled) {
      return this.simpleVoiceAnalysis(text);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a voice command analyzer for a restaurant app. Extract the user\'s intent and relevant parameters from their speech.'
          },
          {
            role: 'user',
            content: `Analyze this voice command: "${text}". Return JSON with: intent (search, recommend, filter, order), cuisine (if mentioned), location (if mentioned), priceRange (if mentioned), mood (if mentioned)`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Voice analysis error:', error.message);
      return this.simpleVoiceAnalysis(text);
    }
  }

  /**
   * Simple fallback voice analysis
   */
  simpleVoiceAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    const intent = lowerText.includes('recommend') ? 'recommend' :
                   lowerText.includes('filter') ? 'filter' :
                   lowerText.includes('order') ? 'order' : 'search';

    const cuisines = ['italian', 'chinese', 'japanese', 'mexican', 'indian', 'american', 'french', 'thai'];
    const detectedCuisine = cuisines.find(c => lowerText.includes(c));

    const moods = ['happy', 'sad', 'stressed', 'excited', 'tired', 'hungry'];
    const detectedMood = moods.find(m => lowerText.includes(m));

    return {
      intent,
      cuisine: detectedCuisine || null,
      mood: detectedMood || null,
      originalText: text
    };
  }
}

module.exports = new AIService();
