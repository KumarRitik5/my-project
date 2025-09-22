
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './MyAppointmentsPage.css';
import StarRating from '../StarRating';


const MyAppointmentsPage = () => {
  const { deactivateAccount } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [activeAppId, setActiveAppId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch all appointments first, then filter on client side
        // This is needed because JSON Server doesn't have proper user auth
        const res = await axios.get('http://localhost:5000/appointments');
        
        // Filter appointments for this specific user
        const userAppointments = res.data.filter(app => 
          app.id && // Ensure appointment has an ID (filter out empty objects)
          app.userId === user.id // Match exact user ID
        );
        
        // Sort appointments by creation date (latest first)
        userAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setAppointments(userAppointments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="loading">Loading your appointments...</div>;
  }



  // Open cancel modal
  const openCancelModal = (id) => {
    setActiveAppId(id);
    setCancelReason('');
    setShowCancelModal(true);
  };

  // Open feedback modal
  const openFeedbackModal = (id) => {
    setActiveAppId(id);
    setFeedbackStars(0);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  // Submit cancellation
  const submitCancel = async () => {
    if (!cancelReason) {
      alert('Cancellation reason is required.');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.patch(`http://localhost:5000/appointments/${activeAppId}`, { 
        status: 'cancelled', 
        cancellationReason: cancelReason,
        cancelledBy: 'customer',
        cancelledByName: user.name,
        cancelledAt: new Date().toISOString()
      });
      setAppointments((prev) => prev.map(app => 
        app.id === activeAppId ? { 
          ...app, 
          status: 'cancelled', 
          cancellationReason: cancelReason,
          cancelledBy: 'customer',
          cancelledByName: user.name,
          cancelledAt: new Date().toISOString()
        } : app
      ));
      setShowCancelModal(false);
      alert('Appointment cancelled successfully.');
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  // Submit feedback
  const submitFeedback = async () => {
    if (feedbackStars === 0 || !feedbackText) {
      alert('Please provide a star rating and feedback.');
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/appointments/${activeAppId}`, { status: 'completed', feedback: feedbackText, stars: feedbackStars });
      setAppointments((prev) => prev.map(app => app.id === activeAppId ? { ...app, status: 'completed', feedback: feedbackText, stars: feedbackStars } : app));
      setShowFeedbackModal(false);
    } catch (err) {
      alert('Failed to mark appointment as completed.');
    }
  };



  return (
    <div className="appointments-page">
      <h1>My Appointments</h1>
      <div className="page-actions">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to deactivate your account? This will log you out and disable your login.')) {
              deactivateAccount();
            }
          }}
          className="deactivate-button"
        >
          Deactivate Account
        </button>
      </div>
      {appointments.length > 0 ? (
        <div className="appointments-grid">
          {appointments.map((app, index) => (
            <div 
              key={app.id || app._id} 
              className={`appointment-card ${index === 0 ? 'latest-booking' : ''}`}
            >
              {index === 0 && (
                <div className="latest-badge">
                  Latest Booking
                </div>
              )}
              
              <div className="appointment-details">
                <h3>{app.serviceName || (app.service && app.service.name)}</h3>
                <p><strong>Date:</strong> {app.date ? new Date(app.date).toLocaleDateString() : ''}</p>
                <p><strong>Time Slot:</strong> {app.slot}</p>
                <p><strong>Status:</strong> <span className={`status status-${app.status}`}>{app.status}</span></p>
                {app.price && (
                  <p><strong>Price:</strong> ₹{app.price}</p>
                )}
              </div>

              {/* Feedback Display */}
              {app.status === 'completed' && (app.stars || app.feedback) && (
                <div className="feedback-display">
                  <strong>Your Feedback:</strong>
                  <StarRating 
                    rating={app.stars || 0} 
                    setRating={() => {}} 
                    size="small" 
                    readonly={true}
                    showText={false}
                  />
                  {app.feedback && <div className="feedback-text">{app.feedback}</div>}
                </div>
              )}

              {/* Cancellation Details */}
              {app.status === 'cancelled' && (app.cancellationReason || app.cancelledBy) && (
                <div className="cancellation-details">
                  <strong>Cancellation Details:</strong>
                  {app.cancellationReason && (
                    <div className="cancellation-item">
                      <strong>Reason:</strong> {app.cancellationReason}
                    </div>
                  )}
                  {app.cancelledBy && (
                    <div className="cancellation-item">
                      <strong>Cancelled by:</strong> {app.cancelledBy === 'customer' ? 'You' : 'Owner/Staff'}
                      {app.cancelledByName && ` (${app.cancelledByName})`}
                    </div>
                  )}
                  {app.cancelledAt && (
                    <div className="cancellation-item">
                      <strong>Cancelled on:</strong> {new Date(app.cancelledAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {app.status === 'confirmed' && (
                <div className="appointment-actions">
                  <button 
                    onClick={() => openCancelModal(app.id)} 
                    className="btn-cancel"
                  >
                    Cancel Appointment
                  </button>
                  <button 
                    onClick={() => openFeedbackModal(app.id)} 
                    className="btn-complete"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-appointments">
          <div className="no-appointments-icon">📅</div>
          <p>You have no appointments booked yet.</p>
        </div>
      )}
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title success">Rate Your Experience</h2>
            
            <StarRating 
              rating={feedbackStars} 
              setRating={setFeedbackStars} 
              size="large" 
              readonly={false}
              showText={true}
            />
            
            <textarea
              rows={4}
              className="modal-textarea"
              placeholder="Write your feedback..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={submitFeedback} className="btn-primary">Submit</button>
              <button onClick={() => setShowFeedbackModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title danger">Cancel Appointment</h2>
            <textarea
              rows={3}
              className="modal-textarea"
              placeholder="Please provide a reason for cancellation..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={submitCancel} className="btn-danger">Submit</button>
              <button onClick={() => setShowCancelModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
