import React, { useState, useEffect } from 'react';
import './StarRating.css';

const StarRating = ({ rating, setRating, size = 'large', readonly = false, showText = true }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (rating > 0) {
      setAnimationClass('star-burst');
      const timer = setTimeout(() => setAnimationClass(''), 600);
      return () => clearTimeout(timer);
    }
  }, [rating]);

  const handleStarClick = (starValue) => {
    if (!readonly) {
      setRating(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const getRatingText = (value) => {
    const texts = {
      0: "✨ Select a rating",
      1: "😞 Poor Service",
      2: "😐 Fair Experience", 
      3: "🙂 Good Service",
      4: "😊 Very Good Experience",
      5: "🤩 Excellent! Amazing!"
    };
    return texts[value] || "";
  };

  const currentRating = hoverRating || rating;

  return (
    <div className={`star-rating-wrapper ${size} ${animationClass}`}>
      {showText && (
        <div className="star-rating-label">
          <span className="rating-icon">⭐</span>
          {readonly ? "Customer Rating" : "Rate Your Experience"}
        </div>
      )}
      
      <div 
        className={`star-rating-container ${readonly ? 'readonly' : 'interactive'}`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="stars-background-glow"></div>
        {[1, 2, 3, 4, 5].map((starValue) => (
          <div
            key={starValue}
            className={`star-wrapper ${currentRating >= starValue ? 'filled' : ''} 
                       ${rating === starValue ? 'selected' : ''}
                       ${hoverRating === starValue ? 'hovered' : ''}`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            style={{ '--star-index': starValue - 1 }}
          >
            <div className="star-background">
              <svg viewBox="0 0 24 24" className="star-icon">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="star-fill">
              <svg viewBox="0 0 24 24" className="star-icon">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="star-sparkle"></div>
            </div>
            {!readonly && (
              <>
                <div className="star-ripple"></div>
                <div className="star-particle"></div>
              </>
            )}
          </div>
        ))}
      </div>

      {showText && (
        <div className={`rating-text ${currentRating > 0 ? 'visible' : ''}`}>
          <span className="rating-value">{getRatingText(currentRating)}</span>
          {currentRating === 5 && !readonly && (
            <div className="excellence-badge">Perfect!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
