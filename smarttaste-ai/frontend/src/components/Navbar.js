import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar Component
 * Main navigation bar with theme toggle and user menu
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          🍽️ SmartTaste AI
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/restaurants" style={styles.link}>Restaurants</Link>
          <Link to="/ai-assistant" style={styles.link}>AI Assistant</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={styles.link}>Profile</Link>
              <span style={styles.userInfo}>
                👤 {user?.name}
              </span>
              <button onClick={logout} style={styles.btnLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={styles.btnRegister}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={styles.themeToggle}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'var(--background-light)',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '16px 0'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--primary-color)',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  userInfo: {
    color: 'var(--text-secondary)',
    fontSize: '14px'
  },
  btnLogout: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--error-color)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  btnRegister: {
    padding: '10px 20px',
    borderRadius: 'var(--radius-md)'
  },
  themeToggle: {
    background: 'none',
    border: '2px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
    fontSize: '20px',
    cursor: 'pointer',
    marginLeft: '16px'
  }
};

export default Navbar;
