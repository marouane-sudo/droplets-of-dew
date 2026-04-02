import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

/**
 * Home Page Component
 * Landing page with featured restaurants and mood-based recommendations
 */
const HomePage = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);

  // Mood options for quick recommendations
  const moods = [
    { emoji: '😊', name: 'happy', color: '#FFD700' },
    { emoji: '😢', name: 'sad', color: '#6495ED' },
    { emoji: '😤', name: 'stressed', color: '#FF6B6B' },
    { emoji: '🤩', name: 'excited', color: '#FF1493' },
    { emoji: '😴', name: 'tired', color: '#9370DB' },
    { emoji: '😋', name: 'hungry', color: '#FF8C00' }
  ];

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll({ limit: 6 });
      setFeaturedRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // Navigate to AI assistant with mood
    setTimeout(() => {
      window.location.href = `/ai-assistant?mood=${mood}`;
    }, 300);
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={styles.heroTitle}>
            🍽️ Find Your Perfect Meal with <span style={{ color: 'var(--primary-color)' }}>AI</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Get personalized restaurant recommendations based on your mood, preferences, and dietary needs
          </p>
          
          <div style={styles.heroButtons}>
            <Link to="/restaurants" className="btn btn-primary" style={styles.heroBtn}>
              Browse Restaurants
            </Link>
            <Link to="/ai-assistant" className="btn btn-secondary" style={styles.heroBtn}>
              Ask AI Assistant
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mood Selection Section */}
      <section style={styles.moodSection}>
        <h2 style={styles.sectionTitle}>How are you feeling?</h2>
        <p style={styles.sectionSubtitle}>
          Select your mood and get AI-powered food recommendations
        </p>
        
        <div style={styles.moodGrid}>
          {moods.map((mood) => (
            <motion.button
              key={mood.name}
              style={{
                ...styles.moodButton,
                backgroundColor: selectedMood === mood.name ? mood.color : 'var(--background-light)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood.name)}
            >
              <span style={styles.moodEmoji}>{mood.emoji}</span>
              <span style={styles.moodName}>{mood.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section style={styles.featuredSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Restaurants</h2>
            <Link to="/restaurants" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div style={styles.restaurantGrid}>
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onClick={() => window.location.href = `/restaurants/${restaurant._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose SmartTaste AI?</h2>
          
          <div style={styles.featuresGrid}>
            <motion.div
              className="card"
              style={styles.featureCard}
              whileHover={{ y: -5 }}
            >
              <div style={styles.featureIcon}>🤖</div>
              <h3 style={styles.featureTitle}>AI Recommendations</h3>
              <p style={styles.featureDescription}>
                Get personalized restaurant suggestions based on your mood and preferences
              </p>
            </motion.div>

            <motion.div
              className="card"
              style={styles.featureCard}
              whileHover={{ y: -5 }}
            >
              <div style={styles.featureIcon}>🎤</div>
              <h3 style={styles.featureTitle}>Voice Search</h3>
              <p style={styles.featureDescription}>
                Simply speak to find restaurants - hands-free and convenient
              </p>
            </motion.div>

            <motion.div
              className="card"
              style={styles.featureCard}
              whileHover={{ y: -5 }}
            >
              <div style={styles.featureIcon}>⏱️</div>
              <h3 style={styles.featureTitle}>Real-Time Wait Times</h3>
              <p style={styles.featureDescription}>
                Know exactly how long you'll wait before you arrive
              </p>
            </motion.div>

            <motion.div
              className="card"
              style={styles.featureCard}
              whileHover={{ y: -5 }}
            >
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>Gamification</h3>
              <p style={styles.featureDescription}>
                Earn points and badges as you explore new restaurants
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh'
  },
  hero: {
    backgroundColor: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '100px 20px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: 1.2
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 40px'
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroBtn: {
    padding: '16px 32px',
    fontSize: '18px'
  },
  moodSection: {
    padding: '80px 20px',
    backgroundColor: 'var(--background-light)',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '16px'
  },
  sectionSubtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '40px'
  },
  moodGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  moodButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 30px',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-md)'
  },
  moodEmoji: {
    fontSize: '40px',
    marginBottom: '8px'
  },
  moodName: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'capitalize',
    color: 'var(--text-primary)'
  },
  featuredSection: {
    padding: '80px 0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    padding: '0 20px'
  },
  viewAllLink: {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px'
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
    padding: '0 20px'
  },
  featuresSection: {
    padding: '80px 20px',
    backgroundColor: 'var(--background-light)'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '40px'
  },
  featureCard: {
    padding: '40px 30px',
    textAlign: 'center'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '12px'
  },
  featureDescription: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6
  }
};

export default HomePage;
