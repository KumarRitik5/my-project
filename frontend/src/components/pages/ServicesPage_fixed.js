import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ServicesPage.css';

const serviceIcons = [
  '💇‍♂️', // Men's Haircut
  '💇‍♀️', // Women's Haircut
  '👶',   // Kids Haircut
  '🧴',   // Hair Wash & Blow Dry
  '💫',   // Hair Styling
  '🎨',   // Hair Coloring
  '✨',   // Highlights & Balayage
  '🌿',   // Keratin Treatment
  '💆‍♀️', // Hair Spa & Scalp Treatment
  '🍓',   // Fruit Facial
  '👑',   // Gold Facial
  '💎',   // Diamond Facial
  '💧',   // HydraFacial
  '🧼',   // Deep Cleanup
  '🌟',   // Chemical Peel
  '💅',   // Classic Manicure
  '🦶',   // Classic Pedicure
  '✨',   // Spa Manicure & Pedicure
  '💎',   // Nail Extensions
  '🎨',   // Nail Art
  '💪',   // Swedish Massage
  '🔥',   // Deep Tissue Massage
  '🌸',   // Aromatherapy Massage
  '🧖‍♀️', // Body Scrub & Polish
  '🌿',   // Body Wrap
  '💨',   // Steam Bath
  '🔥',   // Sauna
  '🛁',   // Jacuzzi
  '💑',   // Couple Spa Package
  '💄',   // Party Makeup
  '👰‍♀️', // Bridal Makeup
  '✨',   // Airbrush Makeup
  '👗',   // Saree Draping
  '🦵',   // Full Body Waxing
  '💪',   // Arms & Legs Waxing
  '🌊',   // Bikini Waxing
  '👁️',   // Eyebrow Threading
  '👄',   // Upper Lip Threading
  '👁️',   // Eyelash Extensions
  '🖋️',   // Eyebrow Microblading
  '🌺',   // Mehendi Design
  '💎',   // Ear Piercing
  '👰‍♀️', // Pre-Bridal Package
  '🤵‍♂️', // Pre-Groom Package
];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate('/book');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/services');
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services.');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="services-container">
      <h1>Our Services</h1>
      {loading ? (
        <div className="loading">Loading services...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="service-list">
          {services.length === 0 ? (
            <p>No services available.</p>
          ) : (
            services.map((service, idx) => (
              <div key={service.id || service._id} className="service-card">
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                  {serviceIcons[idx % serviceIcons.length]}
                </div>
                <h2>{service.name}</h2>
                <div className="service-description" style={{ marginBottom: 10 }}>
                  {service.description || 'No description available.'}
                </div>
                <div className="service-details">
                  <span className="duration">⏱ {service.duration} min</span>
                  <span className="price">₹{service.price}</span>
                </div>
                <button
                  className="book-button"
                  onClick={handleBookNow}
                >
                  {isAuthenticated ? 'Book Now' : 'Login to Book'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
