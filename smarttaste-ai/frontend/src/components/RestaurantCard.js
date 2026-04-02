import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Restaurant Card Component
 * Displays restaurant information in a card format
 */
const RestaurantCard = ({ restaurant, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get busy level color
  const getBusyColor = (level) => {
    switch(level) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#F44336';
      case 'very-high': return '#9C27B0';
      default: return '#4CAF50';
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="card"
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Restaurant Image */}
      <div style={styles.imageContainer}>
        <img 
          src={restaurant.images?.[0] || 'https://via.placeholder.com/400x200?text=Restaurant'} 
          alt={restaurant.name}
          style={styles.image}
        />
        {restaurant.isOpenNow && (
          <span style={styles.openBadge}>Open Now</span>
        )}
      </div>

      {/* Restaurant Info */}
      <div style={styles.content}>
        <h3 style={styles.name}>{restaurant.name}</h3>
        
        {/* Rating */}
        <div style={styles.rating}>
          {renderStars(Math.round(restaurant.rating))}
          <span style={styles.ratingText}>
            {restaurant.rating.toFixed(1)} ({restaurant.numReviews} reviews)
          </span>
        </div>

        {/* Cuisine Type */}
        <div style={styles.cuisine}>
          {restaurant.cuisineType?.slice(0, 3).join(' • ')}
        </div>

        {/* Price Range */}
        <div style={styles.priceRange}>
          {restaurant.priceRange} • ${restaurant.averageCostForTwo || '50-100'} for two
        </div>

        {/* Wait Time & Busy Level */}
        <div style={styles.waitTimeContainer}>
          <span style={styles.waitTime}>
            ⏱️ {restaurant.currentWaitTime || 15}-30 min wait
          </span>
          <div style={styles.busyIndicator}>
            <span style={styles.busyText}>Busy:</span>
            <span 
              style={{
                ...styles.busyDot,
                backgroundColor: getBusyColor(restaurant.busyLevel)
              }}
            />
            <span style={styles.busyLevel}>{restaurant.busyLevel}</span>
          </div>
        </div>

        {/* Location */}
        {restaurant.address && (
          <div style={styles.location}>
            📍 {restaurant.address.city}, {restaurant.address.state}
          </div>
        )}

        {/* View Details Button */}
        <motion.button
          className="btn btn-primary"
          style={styles.viewBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details →
        </motion.button>
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    cursor: 'pointer',
    overflow: 'hidden',
    maxWidth: '400px'
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  openBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '12px',
    fontWeight: '600'
  },
  content: {
    padding: '20px'
  },
  name: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  ratingText: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  cuisine: {
    fontSize: '14px',
    color: 'var(--primary-color)',
    marginBottom: '8px',
    textTransform: 'capitalize'
  },
  priceRange: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '12px'
  },
  waitTimeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px'
  },
  waitTime: {
    color: 'var(--text-secondary)'
  },
  busyIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  busyText: {
    fontSize: '12px',
    color: 'var(--text-secondary)'
  },
  busyDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  busyLevel: {
    fontSize: '12px',
    textTransform: 'capitalize',
    color: 'var(--text-secondary)'
  },
  location: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '16px'
  },
  viewBtn: {
    width: '100%',
    padding: '12px'
  }
};

export default RestaurantCard;
