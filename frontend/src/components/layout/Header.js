import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Initialize theme from localStorage and apply to whole site
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDarkMode);
    // Apply theme to entire document
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', initialDarkMode);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    // Apply theme to entire document and body
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            ✨ Luxe Beauty Salon
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Menu */}
        <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          <Link to="/services" onClick={closeMobileMenu}>Services</Link>
          
          {isAuthenticated ? (
            <>
              {user.role === 'user' && (
                <Link to="/book" onClick={closeMobileMenu}>Book</Link>
              )}
              
              {user.role === 'owner' && (
                <div className="dropdown-menu">
                  <span className="dropdown-trigger">Dashboard ▼</span>
                  <div className="dropdown-content">
                    <Link to="/owner" onClick={closeMobileMenu}>Dashboard</Link>
                    <Link to="/owner/customize" onClick={closeMobileMenu}>🎨 Customize</Link>
                  </div>
                </div>
              )}
              
              {isAdmin && (
                <Link to="/admin" className="admin-link" onClick={closeMobileMenu}>
                  👑 Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </nav>

        {/* User Actions Section */}
        <div className="user-actions">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated && (
            <>
              {/* Notifications */}
              <div className="notification-wrapper">
                <NotificationBell />
              </div>

              {/* User Menu Dropdown */}
              <div className="user-menu-container">
                <div className="user-trigger" onClick={toggleUserMenu}>
                  <div className="user-avatar">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="dropdown-arrow">▼</span>
                </div>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info-dropdown">
                      <div className="user-name">{user.name}</div>
                      <div className="user-role">{user.role}</div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" onClick={closeMobileMenu} className="dropdown-item">
                      👤 Profile
                    </Link>
                    {user.role === 'user' && (
                      <Link to="/my-appointments" onClick={closeMobileMenu} className="dropdown-item">
                        📅 My Appointments
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
