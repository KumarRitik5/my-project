import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../LoadingSkeleton';
import StarRating from '../StarRating';
import axios from 'axios';
import './HomePage.css';
import '../../styles/glassmorphism.css';
import '../../styles/animations.css';
import '../../styles/typography.css';

const HomePage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleBookNow = () => {
    if (isAuthenticated) {
      // If user is authenticated, go to booking page
      navigate('/book');
    } else {
      // If not authenticated, go to login page
      navigate('/login');
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get('http://localhost:5000/homePageConfig');
      console.log('HomePage - Fetched config:', res.data);
      setConfig(res.data);
    } catch (error) {
      console.error('Error fetching home page config:', error);
      // Use default config if fetch fails
      const defaultConfig = getDefaultConfig();
      setConfig(defaultConfig);
      console.log('HomePage - Using default config');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConfig = () => ({
    heroSection: {
      title: "Welcome to Our Premium ✨ Luxe Beauty Salon",
      subtitle: "Experience luxury and relaxation with our professional services",
      ctaText: "Book Now",
      isVisible: true
    },
    offers: [{
      id: "default",
      title: "Summer Offer",
      description: "Get 20% OFF on all spa services! Use code SUMMER20",
      discount: "20%",
      isActive: true,
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff"
    }],
    announcements: [],
    testimonials: {
      title: "What Our Clients Say",
      reviews: [
        {
          id: "default1",
          name: "Priya Sharma",
          rating: 5,
          comment: "Amazing service! The staff is so friendly and professional. Highly recommended!",
          service: "Facial Treatment"
        },
        {
          id: "default2", 
          name: "Rahul Verma",
          rating: 5,
          comment: "Best beauty salon in town! The ambiance is so relaxing and the services are top-notch.",
          service: "Hair Styling"
        },
        {
          id: "default3",
          name: "Simran Kaur",
          rating: 5,
          comment: "I booked a facial and it was amazing! Will definitely come back again.",
          service: "Facial Treatment"
        }
      ],
      isVisible: true
    },
    theme: {
      primaryColor: "#ff6b6b",
      secondaryColor: "#4ecdc4",
      accentColor: "#45b7d1"
    }
  });

  if (loading) {
    return (
      <div className="home-container animate-page-enter">
        <LoadingSkeleton type="hero" />
        <LoadingSkeleton type="service-grid" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '3rem 0' }}>
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Unable to load page configuration. Please try again later.
        </div>
      </div>
    );
  }

  const activeOffers = config?.offers?.filter(offer => offer?.isActive) || [];
  const activeAnnouncements = config?.announcements?.filter(ann => ann?.isActive) || [];

  return (
    <div className="home-container animate-page-enter" style={{'--primary-color': config?.theme?.primaryColor || '#ff6b6b'}}>

      {/* Dynamic Announcements */}
      {activeAnnouncements.length > 0 && (
        <section className="announcements-section" style={{ marginBottom: '2rem' }}>
          {activeAnnouncements.map(announcement => (
            <div 
              key={announcement.id}
              className={`announcement-banner ${announcement.type || 'info'}`}
              style={{ 
                padding: '1rem',
                margin: '0.5rem 0',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              <strong>{announcement.title}</strong>
              {announcement.content && <div>{announcement.content}</div>}
            </div>
          ))}
        </section>
      )}

      {/* Dynamic Offers Banner */}
      {activeOffers.length > 0 && (
        <section className="offers-banner" style={{marginBottom: '2rem', textAlign: 'center'}}>
          {activeOffers.map(offer => (
            <div 
              key={offer.id}
              className="offers-banner-inner" 
              style={{
                display: 'inline-block',
                background: offer?.backgroundColor || '#ff6b6b',
                color: offer?.textColor || '#ffffff',
                padding: '0.8rem 2.5rem',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '1px',
                boxShadow: '0 4px 16px rgba(255,107,107,0.10)',
                animation: 'pulse 1.5s infinite alternate',
                margin: '0.5rem'
              }}
            >
              🎉 {offer.title}: {offer.description}
              {offer.discount && <b> {offer.discount}</b>}
            </div>
          ))}
        </section>
      )}

      {/* Dynamic Hero Section */}
      {config.heroSection?.isVisible && (
        <section className="hero glass-hero animate-fade-in-up">
          <h1 className="hero-title animate-bounce-in">
            <span className="animated-greeting">{config.heroSection.title}</span>
          </h1>
          <p className="text-lead animate-fade-in-up" style={{animationDelay: '0.3s'}}>{config.heroSection.subtitle}</p>
          <button onClick={handleBookNow} className="glass-button animate-pulse-glow hover-bounce btn-press">
            <span className="btn-text">{isAuthenticated ? (config.heroSection.ctaText || 'Book Now') : 'Get Started'}</span>
          </button>
        </section>
      )}

      <section className="features animate-slide-in-left">
        <h2 className="section-title animate-fade-in-up">Our Services</h2>
        <div className="services-grid">
          <div className="service-card glass-service-card stagger-item hover-lift animate-float">
            <div className="service-icon">💇‍♀️</div>
            <h3 className="card-title">Hair Styling</h3>
            <p className="card-text">Expert hair styling and coloring services</p>
          </div>
          <div className="service-card glass-service-card stagger-item hover-lift animate-float-slow">
            <div className="service-icon">💅</div>
            <h3 className="card-title">Nail Care</h3>
            <p className="card-text">Professional manicure and pedicure</p>
          </div>
          <div className="service-card glass-service-card stagger-item hover-lift animate-float-reverse">
            <div className="service-icon">💆‍♀️</div>
            <h3 className="card-title">Spa Treatments</h3>
            <p className="card-text">Relaxing massages and body treatments</p>
          </div>
          <div className="service-card glass-service-card stagger-item hover-lift animate-float">
            <div className="service-icon">✨</div>
            <h3 className="card-title">Facial Care</h3>
            <p className="card-text">Rejuvenating facial treatments</p>
          </div>
        </div>
      </section>

      <section className="why-us animate-slide-in-right">
        <h2 className="section-title animate-fade-in-up">Why Choose Us?</h2>
        <div className="benefits">
          <div className="benefit glass-floating stagger-item hover-scale">
            <h3 className="card-title">Professional Staff</h3>
            <p className="card-text">Experienced and certified professionals</p>
          </div>
          <div className="benefit glass-floating stagger-item hover-scale">
            <h3 className="card-title">Quality Products</h3>
            <p className="card-text">Premium products for the best results</p>
          </div>
          <div className="benefit glass-floating stagger-item hover-scale">
            <h3 className="card-title">Relaxing Environment</h3>
            <p className="card-text">Peaceful and comfortable atmosphere</p>
          </div>
        </div>
      </section>

      {/* Dynamic Testimonials Section */}
      {config?.testimonials?.isVisible && config?.testimonials?.reviews?.length > 0 && (
        <section className="testimonials" style={{margin: '3rem 0'}}>
          <h2 style={{
            textAlign: 'center', 
            color: config?.theme?.primaryColor || '#ff6b6b', 
            fontWeight: 700, 
            marginBottom: '2rem'
          }}>
            {config?.testimonials?.title || 'What Our Clients Say'}
          </h2>
          <div className="testimonials-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem'
          }}>
            {config.testimonials.reviews.map(review => (
              <div 
                key={review.id}
                className="testimonial-card glass-floating" 
                style={{
                  padding: '2rem', 
                  textAlign: 'center'
                }}
              >
                <StarRating 
                  rating={review?.rating || 5} 
                  setRating={() => {}} 
                  size="medium" 
                  readonly={true}
                  showText={false}
                />
                <p style={{fontStyle: 'italic', color: '#666'}}>
                  "{review?.comment || 'Great service!'}"
                </p>
                <div style={{
                  marginTop: '1rem', 
                  fontWeight: 600, 
                  color: config?.theme?.primaryColor || '#ff6b6b'
                }}>
                  {review?.name || 'Anonymous'}
                </div>
                {review?.service && (
                  <div style={{fontSize: '0.9rem', color: '#999', marginTop: '0.5rem'}}>
                    Service: {review.service}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {config?.contactInfo?.isVisible && (
        <section className="contact-info" style={{
          background: config?.theme?.primaryColor || '#ff6b6b', 
          color: 'white', 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          margin: '3rem 0',
          borderRadius: '18px'
        }}>
          <h2 style={{marginBottom: '2rem'}}>Get In Touch</h2>
          <div className="contact-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {config?.contactInfo?.phone && (
              <div>
                <h3>📞 Phone</h3>
                <p>{config.contactInfo.phone}</p>
              </div>
            )}
            {config?.contactInfo?.email && (
              <div>
                <h3>✉️ Email</h3>
                <p>{config.contactInfo.email}</p>
              </div>
            )}
            {config?.contactInfo?.address && (
              <div>
                <h3>📍 Address</h3>
                <p>{config.contactInfo.address}</p>
              </div>
            )}
          </div>
          {config?.contactInfo?.hours && (
            <div style={{marginTop: '2rem'}}>
              <h3>🕒 Working Hours</h3>
              <p>{config.contactInfo.hours}</p>
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default HomePage;
