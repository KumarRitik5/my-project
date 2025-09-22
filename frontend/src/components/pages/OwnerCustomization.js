import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerCustomization.css';

const OwnerCustomization = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info',
    isActive: true
  });
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    rating: 5,
    comment: '',
    service: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('http://localhost:5000/homePageConfig');
      console.log('Fetched config:', res.data);
      setConfig(res.data);
    } catch (error) {
      console.error('Error fetching config:', error);
      // Use default config if fetch fails
      const defaultConfig = getDefaultConfig();
      setConfig(defaultConfig);
      console.log('Using default config:', defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConfig = () => ({
    id: "homepage-config",
    heroSection: {
      title: "Welcome to Our Premium ✨ Luxe Beauty Salon",
      subtitle: "Experience luxury and relaxation with our professional services",
      backgroundImage: "",
      ctaText: "Book Now",
      isVisible: true
    },
    offers: [{
      id: "offer1",
      title: "New Customer Special",
      description: "Get 20% off on your first visit",
      discount: "20%",
      validUntil: "2025-12-31",
      isActive: true,
      backgroundColor: "#ff6b6b",
      textColor: "#ffffff"
    }],
    announcements: [],
    aboutSection: {
      title: "About Our ✨ Luxe Beauty Salon",
      content: "We provide premium beauty and wellness services in a luxurious environment.",
      isVisible: true
    },
    gallery: {
      title: "Our Work",
      images: [],
      isVisible: true
    },
    testimonials: {
      title: "What Our Clients Say",
      reviews: [{
        id: "review1",
        name: "Sarah Johnson",
        rating: 5,
        comment: "Amazing service! The staff is professional and the atmosphere is so relaxing.",
        service: "Facial Treatment"
      }],
      isVisible: true
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      isVisible: true
    },
    contactInfo: {
      phone: "+1-234-567-8900",
      email: "info@luxebeautysalon.com",
      address: "123 Beauty Street, Spa City, SC 12345",
      hours: "Mon-Fri: 9AM-8PM, Sat: 9AM-6PM, Sun: 10AM-5PM",
      isVisible: true
    },
    theme: {
      primaryColor: "#ff6b6b",
      secondaryColor: "#4ecdc4",
      accentColor: "#45b7d1",
      fontFamily: "Inter, sans-serif"
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: "default"
  });

  const saveConfig = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedConfig = {
        ...config,
        lastUpdated: new Date().toISOString(),
        updatedBy: user?.id || 'unknown'
      };
      
      console.log('Saving config:', updatedConfig);
      
      // Use PUT to update the entire homePageConfig object
      await axios.put('http://localhost:5000/homePageConfig', updatedConfig);
      
      setConfig(updatedConfig);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      alert('Error saving configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateHeroSection = (field, value) => {
    setConfig(prev => ({
      ...prev,
      heroSection: {
        ...prev.heroSection,
        [field]: value
      }
    }));
  };

  const addOffer = () => {
    if (!newOffer.title || !newOffer.description) return;
    
    const offer = {
      ...newOffer,
      id: Date.now().toString(),
      isActive: true
    };
    
    setConfig(prev => ({
      ...prev,
      offers: [...prev.offers, offer]
    }));
    
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      validUntil: '',
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff'
    });
  };

  const toggleOffer = (offerId) => {
    setConfig(prev => ({
      ...prev,
      offers: prev.offers.map(offer =>
        offer.id === offerId ? { ...offer, isActive: !offer.isActive } : offer
      )
    }));
  };

  const deleteOffer = (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setConfig(prev => ({
        ...prev,
        offers: prev.offers.filter(offer => offer.id !== offerId)
      }));
    }
  };

  const addAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    
    const announcement = {
      ...newAnnouncement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setConfig(prev => ({
      ...prev,
      announcements: [...prev.announcements, announcement]
    }));
    
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'info',
      isActive: true
    });
  };

  const deleteAnnouncement = (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setConfig(prev => ({
        ...prev,
        announcements: prev.announcements.filter(ann => ann.id !== announcementId)
      }));
    }
  };

  const addTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.comment) return;
    
    const testimonial = {
      ...newTestimonial,
      id: Date.now().toString()
    };
    
    setConfig(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: [...prev.testimonials.reviews, testimonial]
      }
    }));
    
    setNewTestimonial({
      name: '',
      rating: 5,
      comment: '',
      service: ''
    });
  };

  const deleteTestimonial = (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setConfig(prev => ({
        ...prev,
        testimonials: {
          ...prev.testimonials,
          reviews: prev.testimonials.reviews.filter(review => review.id !== testimonialId)
        }
      }));
    }
  };

  const updateContactInfo = (field, value) => {
    setConfig(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const updateSocialMedia = (platform, url) => {
    setConfig(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: url
      }
    }));
  };

  const updateTheme = (property, value) => {
    setConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [property]: value
      }
    }));
  };

  if (loading) {
    return <div className="customization-loading">Loading customization panel...</div>;
  }

  if (!config) {
    return <div className="customization-error">Error loading configuration</div>;
  }

  return (
    <div className="customization-container">
      <div className="customization-header">
        <h1>🎨 Customize Your Home Page</h1>
        <p>Personalize your ✨ Luxe Beauty Salon's homepage to attract more customers</p>
        <button 
          className="save-button" 
          onClick={saveConfig}
          disabled={saving}
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      <div className="customization-tabs">
        <button 
          className={`tab ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          🏠 Hero Section
        </button>
        <button 
          className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          🎉 Offers & Promotions
        </button>
        <button 
          className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          📢 Announcements
        </button>
        <button 
          className={`tab ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          ⭐ Testimonials
        </button>
        <button 
          className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          📞 Contact & Social
        </button>
        <button 
          className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          🎨 Theme & Colors
        </button>
      </div>

      <div className="customization-content">
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="tab-content">
            <h2>Hero Section</h2>
            <div className="form-group">
              <label>Main Title</label>
              <input
                type="text"
                value={config.heroSection.title}
                onChange={(e) => updateHeroSection('title', e.target.value)}
                placeholder="Welcome to Our Premium ✨ Luxe Beauty Salon"
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <textarea
                value={config.heroSection.subtitle}
                onChange={(e) => updateHeroSection('subtitle', e.target.value)}
                placeholder="Experience luxury and relaxation..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Call-to-Action Button Text</label>
              <input
                type="text"
                value={config.heroSection.ctaText}
                onChange={(e) => updateHeroSection('ctaText', e.target.value)}
                placeholder="Book Now"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={config.heroSection.isVisible}
                  onChange={(e) => updateHeroSection('isVisible', e.target.checked)}
                />
                Show Hero Section
              </label>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="tab-content">
            <h2>Offers & Promotions</h2>
            
            {/* Add New Offer */}
            <div className="add-section">
              <h3>Add New Offer</h3>
              <div className="offer-form">
                <input
                  type="text"
                  placeholder="Offer Title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                />
                <textarea
                  placeholder="Offer Description"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  rows="2"
                />
                <input
                  type="text"
                  placeholder="Discount (e.g., 20% OFF)"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Valid Until"
                  value={newOffer.validUntil}
                  onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                />
                <div className="color-inputs">
                  <label>
                    Background:
                    <input
                      type="color"
                      value={newOffer.backgroundColor}
                      onChange={(e) => setNewOffer({...newOffer, backgroundColor: e.target.value})}
                    />
                  </label>
                  <label>
                    Text:
                    <input
                      type="color"
                      value={newOffer.textColor}
                      onChange={(e) => setNewOffer({...newOffer, textColor: e.target.value})}
                    />
                  </label>
                </div>
                <button className="add-button" onClick={addOffer}>
                  ➕ Add Offer
                </button>
              </div>
            </div>

            {/* Existing Offers */}
            <div className="offers-list">
              <h3>Current Offers</h3>
              {config.offers.map(offer => (
                <div key={offer.id} className="offer-item">
                  <div 
                    className="offer-preview"
                    style={{
                      backgroundColor: offer.backgroundColor,
                      color: offer.textColor
                    }}
                  >
                    <strong>{offer.title}</strong> - {offer.description}
                  </div>
                  <div className="offer-actions">
                    <button 
                      className={`toggle-button ${offer.isActive ? 'active' : 'inactive'}`}
                      onClick={() => toggleOffer(offer.id)}
                    >
                      {offer.isActive ? '✅ Active' : '❌ Inactive'}
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => deleteOffer(offer.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="tab-content">
            <h2>Announcements</h2>
            
            {/* Add New Announcement */}
            <div className="add-section">
              <h3>Add New Announcement</h3>
              <div className="announcement-form">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                />
                <textarea
                  placeholder="Announcement Content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  rows="3"
                />
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
                <button className="add-button" onClick={addAnnouncement}>
                  ➕ Add Announcement
                </button>
              </div>
            </div>

            {/* Existing Announcements */}
            <div className="announcements-list">
              <h3>Current Announcements</h3>
              {config.announcements.map(announcement => (
                <div key={announcement.id} className="announcement-item">
                  <div className={`announcement-preview ${announcement.type}`}>
                    <strong>{announcement.title}</strong>
                    <p>{announcement.content}</p>
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => deleteAnnouncement(announcement.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="tab-content">
            <h2>Customer Testimonials</h2>
            
            {/* Add New Testimonial */}
            <div className="add-section">
              <h3>Add New Testimonial</h3>
              <div className="testimonial-form">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                />
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 stars)</option>
                  <option value={3}>⭐⭐⭐ (3 stars)</option>
                  <option value={2}>⭐⭐ (2 stars)</option>
                  <option value={1}>⭐ (1 star)</option>
                </select>
                <textarea
                  placeholder="Customer Comment"
                  value={newTestimonial.comment}
                  onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Service Used (optional)"
                  value={newTestimonial.service}
                  onChange={(e) => setNewTestimonial({...newTestimonial, service: e.target.value})}
                />
                <button className="add-button" onClick={addTestimonial}>
                  ➕ Add Testimonial
                </button>
              </div>
            </div>

            {/* Existing Testimonials */}
            <div className="testimonials-list">
              <h3>Current Testimonials</h3>
              {config.testimonials.reviews.map(review => (
                <div key={review.id} className="testimonial-item">
                  <div className="testimonial-preview">
                    <div className="testimonial-header">
                      <strong>{review.name}</strong>
                      <span className="rating">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p>"{review.comment}"</p>
                    {review.service && <small>Service: {review.service}</small>}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => deleteTestimonial(review.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Social Tab */}
        {activeTab === 'contact' && (
          <div className="tab-content">
            <h2>Contact Information & Social Media</h2>
            
            <div className="contact-section">
              <h3>Contact Details</h3>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={config.contactInfo.phone}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={config.contactInfo.email}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={config.contactInfo.address}
                  onChange={(e) => updateContactInfo('address', e.target.value)}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>Business Hours</label>
                <input
                  type="text"
                  value={config.contactInfo.hours}
                  onChange={(e) => updateContactInfo('hours', e.target.value)}
                  placeholder="Mon-Fri: 9AM-8PM, Sat: 9AM-6PM"
                />
              </div>
            </div>

            <div className="social-section">
              <h3>Social Media Links</h3>
              <div className="form-group">
                <label>Facebook URL</label>
                <input
                  type="url"
                  value={config.socialMedia.facebook}
                  onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                  placeholder="https://facebook.com/yoursalon"
                />
              </div>
              <div className="form-group">
                <label>Instagram URL</label>
                <input
                  type="url"
                  value={config.socialMedia.instagram}
                  onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                  placeholder="https://instagram.com/yoursalon"
                />
              </div>
              <div className="form-group">
                <label>Twitter URL</label>
                <input
                  type="url"
                  value={config.socialMedia.twitter}
                  onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                  placeholder="https://twitter.com/yoursalon"
                />
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="tab-content">
            <h2>Theme & Colors</h2>
            
            <div className="theme-section">
              <div className="color-group">
                <label>Primary Color</label>
                <input
                  type="color"
                  value={config.theme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                />
                <span className="color-value">{config.theme.primaryColor}</span>
              </div>
              <div className="color-group">
                <label>Secondary Color</label>
                <input
                  type="color"
                  value={config.theme.secondaryColor}
                  onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                />
                <span className="color-value">{config.theme.secondaryColor}</span>
              </div>
              <div className="color-group">
                <label>Accent Color</label>
                <input
                  type="color"
                  value={config.theme.accentColor}
                  onChange={(e) => updateTheme('accentColor', e.target.value)}
                />
                <span className="color-value">{config.theme.accentColor}</span>
              </div>
            </div>

            <div className="theme-preview">
              <h3>Theme Preview</h3>
              <div className="preview-card" style={{
                backgroundColor: config.theme.primaryColor,
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4>Primary Color Sample</h4>
                <p>This is how your primary color will look</p>
              </div>
              <div className="preview-card" style={{
                backgroundColor: config.theme.secondaryColor,
                color: 'white',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4>Secondary Color Sample</h4>
                <p>This is how your secondary color will look</p>
              </div>
              <div className="preview-card" style={{
                backgroundColor: config.theme.accentColor,
                color: 'white',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <h4>Accent Color Sample</h4>
                <p>This is how your accent color will look</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerCustomization;
