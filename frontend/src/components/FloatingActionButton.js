import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/animations.css';
import '../styles/glassmorphism.css';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show FAB based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleMainAction = () => {
    if (isAuthenticated) {
      navigate('/book');
    } else {
      navigate('/login');
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const quickActions = [
    {
      icon: '📞',
      label: 'Call Us',
      action: () => window.open('tel:+1234567890', '_self'),
      color: '#4ecdc4'
    },
    {
      icon: '💬',
      label: 'Chat',
      action: () => navigate('/contact'),
      color: '#45b7d1'
    },
    {
      icon: '📍',
      label: 'Location',
      action: () => window.open('https://maps.google.com', '_blank'),
      color: '#f39c12'
    }
  ];

  return (
    <>
      {/* Main FAB */}
      <div 
        className={`fab-container ${isVisible ? 'fab-visible' : 'fab-hidden'}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100px)'
        }}
      >
        {/* Quick Action Buttons */}
        {isExpanded && (
          <div className="fab-quick-actions" style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="fab-quick-action glass-button"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  background: `linear-gradient(45deg, ${action.color}, ${action.color}dd)`,
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 8px 32px ${action.color}33`,
                  animation: `fadeInUp 0.3s ease ${index * 0.1}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                title={action.label}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = `0 12px 40px ${action.color}55`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = `0 8px 32px ${action.color}33`;
                }}
              >
                {action.icon}
              </button>
            ))}
          </div>
        )}

        {/* Menu Toggle Button */}
        <button
          onClick={toggleExpanded}
          className="fab-menu-toggle glass-button"
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '5px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            color: '#ff6b6b',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)'
          }}
          title={isExpanded ? 'Close Menu' : 'Quick Actions'}
        >
          {isExpanded ? '✕' : '⚡'}
        </button>

        {/* Main Action Button */}
        <button
          onClick={handleMainAction}
          className="fab-main glass-button animate-pulse-glow"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          title={isAuthenticated ? 'Book Appointment' : 'Get Started'}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 16px 50px rgba(255, 107, 107, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)';
          }}
        >
          {isAuthenticated ? '📅' : '🚀'}
        </button>

        {/* Ripple Effect */}
        <div 
          className="fab-ripple"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Mobile Optimization */}
      <style jsx>{`
        @media (max-width: 768px) {
          .fab-container {
            bottom: 15px !important;
            right: 15px !important;
          }
          
          .fab-main {
            width: 55px !important;
            height: 55px !important;
            font-size: 22px !important;
          }
          
          .fab-quick-action {
            width: 45px !important;
            height: 45px !important;
            font-size: 18px !important;
          }
          
          .fab-menu-toggle {
            width: 45px !important;
            height: 45px !important;
            font-size: 14px !important;
            bottom: 70px !important;
          }
          
          .fab-quick-actions {
            bottom: 70px !important;
          }
        }
        
        .fab-hidden {
          opacity: 0;
          pointer-events: none;
        }
        
        .fab-visible {
          opacity: 1;
          pointer-events: all;
        }
        
        /* Pulse ring animation */
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .fab-main {
            animation: none !important;
          }
          
          .fab-ripple {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingActionButton;
