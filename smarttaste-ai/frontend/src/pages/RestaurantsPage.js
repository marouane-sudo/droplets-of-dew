import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { restaurantAPI } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

/**
 * Restaurants Page Component
 * Browse and filter restaurants
 */
const RestaurantsPage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cuisineType: '',
    priceRange: '',
    minRating: '',
    isOpenNow: false
  });

  const cuisineTypes = ['italian', 'chinese', 'japanese', 'mexican', 'indian', 'american', 'french', 'thai', 'mediterranean'];
  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.cuisineType) params.cuisineType = filters.cuisineType;
      if (filters.priceRange) params.priceRange = filters.priceRange;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.isOpenNow) params.isOpenNow = true;

      const response = await restaurantAPI.getAll(params);
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      cuisineType: '',
      priceRange: '',
      minRating: '',
      isOpenNow: false
    });
  };

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>🍽️ Browse Restaurants</h1>
          <p style={styles.subtitle}>Discover amazing places to eat</p>
        </motion.div>

        {/* Filters Section */}
        <div className="card" style={styles.filtersCard}>
          <div style={styles.filtersHeader}>
            <h3 style={styles.filtersTitle}>Filters</h3>
            <button onClick={clearFilters} style={styles.clearBtn}>
              Clear All
            </button>
          </div>

          <div style={styles.filtersGrid}>
            {/* Cuisine Type Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Cuisine Type</label>
              <select
                value={filters.cuisineType}
                onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
                className="input"
                style={styles.select}
              >
                <option value="">All Cuisines</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="input"
                style={styles.select}
              >
                <option value="">Any Price</option>
                {priceRanges.map(price => (
                  <option key={price} value={price}>{price}</option>
                ))}
              </select>
            </div>

            {/* Minimum Rating Filter */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="input"
                style={styles.select}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>

            {/* Open Now Toggle */}
            <div style={styles.filterGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.isOpenNow}
                  onChange={(e) => handleFilterChange('isOpenNow', e.target.checked)}
                  style={styles.checkbox}
                />
                <span>Open Now Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={styles.resultsSection}>
          <div style={styles.resultsHeader}>
            <p style={styles.resultsCount}>
              {loading ? 'Loading...' : `${restaurants.length} restaurants found`}
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🔍</span>
              <h3>No restaurants found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={styles.restaurantGrid}>
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '40px 0'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)'
  },
  filtersCard: {
    marginBottom: '40px',
    padding: '24px'
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  filtersTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  },
  select: {
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--border-color)',
    backgroundColor: 'var(--background-light)',
    color: 'var(--text-primary)',
    fontSize: '16px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    color: 'var(--text-primary)',
    cursor: 'pointer'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  resultsSection: {
    marginTop: '40px'
  },
  resultsHeader: {
    marginBottom: '20px'
  },
  resultsCount: {
    fontSize: '16px',
    color: 'var(--text-secondary)'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '16px'
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px'
  }
};

export default RestaurantsPage;
