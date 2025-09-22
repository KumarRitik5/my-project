import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OwnerDashboard.css';

// Star icon for feedback
const Star = ({ filled }) => (
  <span className={filled ? 'star-filled' : 'star-empty'}>★</span>
);

const OwnerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [editServiceId, setEditServiceId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackService, setFeedbackService] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeAppId, setActiveAppId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, servRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/appointments'),
        axios.get('http://localhost:5000/services'),
        axios.get('http://localhost:5000/users'),
      ]);
      setAppointments(appsRes.data.filter(app => app.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Filter out empty objects and sort by latest first
      setServices(servRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
      alert('Failed to load data.');
    }
    setLoading(false);
  };

  const handleServiceFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/services', {
        ...serviceForm,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
      });
      setShowServiceForm(false);
      setServiceForm({ name: '', price: '', duration: '', description: '' });
      fetchData();
    } catch {
      alert('Failed to add service.');
    }
  };

  const handleEditService = (service) => {
    setEditServiceId(service.id || service._id);
    setServiceForm({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description || '',
    });
    setShowServiceForm(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/services/${editServiceId}`, {
        ...serviceForm,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
      });
      setEditServiceId(null);
      setShowServiceForm(false);
      setServiceForm({ name: '', price: '', duration: '', description: '' });
      fetchData();
    } catch {
      alert('Failed to update service.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:5000/services/${id}`);
      fetchData();
    } catch {
      alert('Failed to delete service.');
    }
  };

  // Owner can confirm or reject (cancel) appointment
  const handleUpdateStatus = async (id, status) => {
    if (status === 'cancelled') {
      setActiveAppId(id);
      setCancelReason('');
      setShowCancelModal(true);
      return;
    }
    
    try {
      // Add updated timestamp when status changes
      await axios.patch(`http://localhost:5000/appointments/${id}`, { 
        status,
        updatedAt: new Date().toISOString()
      });
      fetchData();
    } catch {
      alert('Failed to update appointment status.');
    }
  };

  const submitCancel = async () => {
    if (!cancelReason) {
      alert('Cancellation reason is required.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      await axios.patch(`http://localhost:5000/appointments/${activeAppId}`, {
        status: 'cancelled',
        cancellationReason: cancelReason,
        cancelledBy: 'owner',
        cancelledByName: user.name || 'Owner/Staff',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setShowCancelModal(false);
      setCancelReason('');
      setActiveAppId(null);
      fetchData();
      alert('Appointment cancelled successfully!');
    } catch {
      alert('Failed to cancel appointment.');
    }
  };

  // Calculate average rating for a service
  const getServiceRating = (serviceId) => {
    const serviceApps = appointments.filter(app => app.serviceId === serviceId && app.stars);
    if (serviceApps.length === 0) return null;
    const avg = serviceApps.reduce((sum, app) => sum + (app.stars || 0), 0) / serviceApps.length;
    return avg.toFixed(1);
  };

  // Collect all feedbacks for a service
  const getServiceFeedbacks = (serviceId) => {
    return appointments.filter(app => app.serviceId === serviceId && app.feedback);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="owner-dashboard">
      <h2>Owner Dashboard</h2>
      
      <h3>All Appointments</h3>
      
      {/* Service Ratings Section */}
      <div className="service-ratings-section">
        <h4>Service Ratings & Feedback</h4>
        <div className="service-ratings-grid">
          {services.map(service => {
            const avg = getServiceRating(service.id || service._id);
            const feedbacks = getServiceFeedbacks(service.id || service._id);
            return (
              <div key={service.id || service._id} className="service-rating-card">
                <div className="service-name">{service.name}</div>
                <div className="rating-info">
                  <span style={{ fontWeight: 500 }}>Avg Rating: </span>
                  {avg ? (
                    <span className="rating-value">{avg} / 5</span>
                  ) : (
                    <span className="no-ratings">No ratings</span>
                  )}
                </div>
                <button 
                  onClick={() => { setFeedbackService(service); setShowFeedbackModal(true); }} 
                  className="view-feedbacks-btn"
                >
                  View Feedbacks
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Slot</th>
              <th>Price</th>
              <th>Status</th>
              <th>Cancellation Info</th>
              <th>Actions</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>No appointments found.</td></tr>
            ) : (
              appointments.map((app, index) => {
                const user = users.find(u => u.id === app.userId);
                const isLatest = index === 0;
                
                return (
                  <tr key={app.id || app._id} className={isLatest ? 'latest-appointment' : ''}>
                    <td style={{ position: 'relative' }}>
                      {isLatest && (
                        <span className="new-badge">NEW</span>
                      )}
                      {user ? user.name : `Unknown User (${app.userId})`}
                    </td>
                    <td>{app.serviceName}</td>
                    <td>{app.date}</td>
                    <td>{app.slot}</td>
                    <td>₹{app.price}</td>
                    <td>
                      <span className={`status-badge status-${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'cancelled' && (
                        <div style={{ fontSize: '0.85rem' }}>
                          {app.cancellationReason && (
                            <div><strong>Reason:</strong> {app.cancellationReason}</div>
                          )}
                          {app.cancelledBy && (
                            <div><strong>Cancelled by:</strong> {app.cancelledBy === 'customer' ? 'Customer' : 'Owner/Staff'}</div>
                          )}
                          {app.cancelledAt && (
                            <div><strong>When:</strong> {new Date(app.cancelledAt).toLocaleDateString()}</div>
                          )}
                        </div>
                      )}
                      {app.status !== 'cancelled' && '-'}
                    </td>
                    <td>
                      {app.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'confirmed')}
                            className="btn-confirm"
                          >Confirm</button>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'cancelled')}
                            className="btn-cancel"
                          >Cancel</button>
                        </div>
                      )}
                      {app.status === 'confirmed' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'completed')}
                            className="btn-complete"
                          >Complete</button>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'cancelled')}
                            className="btn-cancel"
                          >Cancel</button>
                        </div>
                      )}
                      {(app.status === 'cancelled' || app.status === 'completed') && (
                        <span className="no-actions">No actions</span>
                      )}
                    </td>
                    <td>
                      {app.stars && (
                        <div>{[...Array(5)].map((_, i) => <Star key={i} filled={i < app.stars} />)}</div>
                      )}
                      {app.feedback && (
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{app.feedback}</div>
                      )}
                      {!app.stars && !app.feedback && '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Services Management Section */}
      <h3>Manage Services</h3>
      <button 
        onClick={() => { setShowServiceForm(true); setEditServiceId(null); setServiceForm({ name: '', price: '', duration: '', description: '' }); }} 
        className="add-service-btn"
      >
        Add New Service
      </button>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id || service._id} className="service-card">
            <h4>{service.name}</h4>
            <div className="service-description">{service.description}</div>
            <div className="service-price">Price: <b>₹{service.price}</b></div>
            <div className="service-duration">Duration: {service.duration} min</div>
            <button onClick={() => handleEditService(service)} className="btn-edit">Edit</button>
            <button onClick={() => handleDeleteService(service.id || service._id)} className="btn-delete">Delete</button>
          </div>
        ))}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Cancel Appointment</h3>
            <p className="modal-text">Please provide a reason for cancelling this appointment:</p>
            <textarea
              rows={4}
              className="modal-textarea"
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={submitCancel} className="btn-cancel">Cancel Appointment</button>
              <button onClick={() => setShowCancelModal(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="modal-overlay">
          <form onSubmit={editServiceId ? handleUpdateService : handleAddService} className="modal-form">
            <h2 className="modal-title">{editServiceId ? 'Edit Service' : 'Add New Service'}</h2>
            <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} placeholder="Service Name" required />
            <input name="price" value={serviceForm.price} onChange={handleServiceFormChange} placeholder="Price" type="number" min="0" required />
            <input name="duration" value={serviceForm.duration} onChange={handleServiceFormChange} placeholder="Duration (min)" type="number" min="1" required />
            <textarea name="description" value={serviceForm.description} onChange={handleServiceFormChange} placeholder="Description" rows={3} />
            <div className="modal-buttons">
              <button type="submit" className="btn-primary">{editServiceId ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => { setShowServiceForm(false); setEditServiceId(null); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback Modal for Service */}
      {showFeedbackModal && feedbackService && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <h2 className="modal-title">Feedback for {feedbackService.name}</h2>
            <div className="feedback-list">
              {getServiceFeedbacks(feedbackService.id || feedbackService._id).length === 0 ? (
                <div className="no-feedback">No feedbacks yet.</div>
              ) : (
                getServiceFeedbacks(feedbackService.id || feedbackService._id).map((fb, idx) => (
                  <div key={idx} className="feedback-item">
                    <div className="feedback-user">{users.find(u => u.id === fb.userId)?.name || fb.userId}</div>
                    <div className="feedback-stars">{[...Array(5)].map((_, i) => <Star key={i} filled={i < (fb.stars || 0)} />)}</div>
                    <div className="feedback-text">{fb.feedback}</div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => { setShowFeedbackModal(false); setFeedbackService(null); }} className="btn-secondary">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
