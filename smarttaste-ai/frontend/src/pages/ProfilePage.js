import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Profile Page Component
 * Display and edit user profile with gamification stats
 */
const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    preferences: {
      dietaryRestrictions: user?.preferences?.dietaryRestrictions || [],
      favoriteCuisines: user?.preferences?.favoriteCuisines || [],
      spicyLevel: user?.preferences?.spicyLevel || 'medium',
      allergies: user?.preferences?.allergies || []
    }
  });

  const cuisineOptions = ['italian', 'chinese', 'japanese', 'mexican', 'indian', 'american', 'french', 'thai', 'mediterranean'];
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'];
  const spicyLevels = ['mild', 'medium', 'hot', 'extra-hot'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: value
      }
    }));
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  // Sample badges (in real app, these would come from backend)
  const allBadges = [
    { name: 'First Order', description: 'Completed your first order', icon: '🎉' },
    { name: 'Food Explorer', description: 'Tried 5 different cuisines', icon: '🌍' },
    { name: 'Review Master', description: 'Wrote 10 reviews', icon: '⭐' },
    { name: 'Loyal Customer', description: 'Ordered 20 times', icon: '👑' },
    { name: 'Healthy Eater', description: 'Tracked 50 meals', icon: '🥗' },
    { name: 'Night Owl', description: 'Ordered after midnight', icon: '🦉' }
  ];

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>👤 My Profile</h1>
        </motion.div>

        <div style={styles.grid}>
          {/* Profile Info Card */}
          <div className="card" style={styles.card}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 style={styles.userName}>{user?.name}</h2>
                <p style={styles.userEmail}>{user?.email}</p>
              </div>
            </div>

            {/* Gamification Stats */}
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <span style={styles.statIcon}>⭐</span>
                <div>
                  <div style={styles.statValue}>{user?.points || 0}</div>
                  <div style={styles.statLabel}>Points</div>
                </div>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statIcon}>🎯</span>
                <div>
                  <div style={styles.statValue}>Level {user?.level || 1}</div>
                  <div style={styles.statLabel}>Level</div>
                </div>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statIcon}>🏆</span>
                <div>
                  <div style={styles.statValue}>{user?.badges?.length || 0}</div>
                  <div style={styles.statLabel}>Badges</div>
                </div>
              </div>
              <div style={styles.statBox}>
                <span style={styles.statIcon}>📦</span>
                <div>
                  <div style={styles.statValue}>{user?.totalOrders || 0}</div>
                  <div style={styles.statLabel}>Orders</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={styles.badgesSection}>
              <h3 style={styles.sectionTitle}>My Badges</h3>
              <div style={styles.badgesGrid}>
                {user?.badges?.length > 0 ? (
                  user.badges.map((badge, index) => (
                    <div key={index} style={styles.badge} title={badge.description}>
                      <span style={styles.badgeIcon}>🏅</span>
                      <span style={styles.badgeName}>{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <p style={styles.noBadges}>No badges yet. Keep ordering to earn badges!</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="card" style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Food Preferences</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-secondary"
                  style={styles.editBtn}
                >
                  Edit
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)} 
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Dietary Restrictions */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Dietary Restrictions</label>
                  <div style={styles.checkboxGrid}>
                    {dietaryOptions.map(option => (
                      <label key={option} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.preferences.dietaryRestrictions.includes(option)}
                          onChange={() => handlePreferenceChange(
                            'dietaryRestrictions',
                            toggleArrayItem(formData.preferences.dietaryRestrictions, option)
                          )}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Favorite Cuisines */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Favorite Cuisines</label>
                  <div style={styles.checkboxGrid}>
                    {cuisineOptions.map(cuisine => (
                      <label key={cuisine} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.preferences.favoriteCuisines.includes(cuisine)}
                          onChange={() => handlePreferenceChange(
                            'favoriteCuisines',
                            toggleArrayItem(formData.preferences.favoriteCuisines, cuisine)
                          )}
                        />
                        <span>{cuisine}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Spice Level Preference</label>
                  <select
                    value={formData.preferences.spicyLevel}
                    onChange={(e) => handlePreferenceChange('spicyLevel', e.target.value)}
                    className="input"
                    style={styles.select}
                  >
                    {spicyLevels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={styles.saveBtn}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div style={styles.preferencesDisplay}>
                <div style={styles.prefSection}>
                  <strong>Dietary Restrictions:</strong>
                  <p>{formData.preferences.dietaryRestrictions.length > 0 
                    ? formData.preferences.dietaryRestrictions.join(', ') 
                    : 'None'}</p>
                </div>
                <div style={styles.prefSection}>
                  <strong>Favorite Cuisines:</strong>
                  <p>{formData.preferences.favoriteCuisines.length > 0 
                    ? formData.preferences.favoriteCuisines.join(', ') 
                    : 'Not specified'}</p>
                </div>
                <div style={styles.prefSection}>
                  <strong>Spice Level:</strong>
                  <p>{formData.preferences.spicyLevel}</p>
                </div>
              </div>
            )}
          </div>
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
    color: 'var(--text-primary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px'
  },
  card: {
    padding: '30px'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold'
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '4px'
  },
  userEmail: {
    fontSize: '16px',
    color: 'var(--text-secondary)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  statBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--radius-md)'
  },
  statIcon: {
    fontSize: '24px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)'
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)'
  },
  badgesSection: {
    marginTop: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '16px'
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px'
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center'
  },
  badgeIcon: {
    fontSize: '24px',
    marginBottom: '4px'
  },
  badgeName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  noBadges: {
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    gridColumn: '1 / -1'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)'
  },
  editBtn: {
    padding: '8px 16px',
    fontSize: '14px'
  },
  cancelBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  select: {
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--border-color)',
    backgroundColor: 'var(--background-light)',
    color: 'var(--text-primary)'
  },
  saveBtn: {
    padding: '14px',
    marginTop: '10px'
  },
  preferencesDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  prefSection: {
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)'
  }
};

export default ProfilePage;
