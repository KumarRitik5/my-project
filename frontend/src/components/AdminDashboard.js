import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../utils/jsonApi';
import { isJsonMode } from '../utils/apiConfig';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeAppId, setActiveAppId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      // If using JSON mode, directly fetch from JSON server
      if (isJsonMode()) {
        try {
          const res = await appointmentAPI.getAppointments();
          const sortedAppointments = res.data.filter(app => app.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAppointments(sortedAppointments);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setLoading(false);
        }
        return;
      }

      // MongoDB mode with authentication fallback
      const token = localStorage.getItem('token');
      if (!token) {
        // Try to get appointments from JSON server if no token
        try {
          const res = await appointmentAPI.getAppointments();
          const sortedAppointments = res.data.filter(app => app.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAppointments(sortedAppointments);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setLoading(false);
        }
        return;
      }

      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get('http://localhost:5000/api/staff/appointments', config);
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        if (err.response?.status === 403 || err.response?.status === 401) {
          // Fallback to JSON server
          try {
            const res = await appointmentAPI.getAppointments();
            const sortedAppointments = res.data.filter(app => app.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAppointments(sortedAppointments);
            setLoading(false);
          } catch (err2) {
            console.error('Error fetching appointments:', err2);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };
    fetchAppointments();
  }, [navigate]);

  const handleUpdateStatus = async (appointmentId, status) => {
    if (status === 'cancelled') {
      setActiveAppId(appointmentId);
      setCancelReason('');
      setShowCancelModal(true);
      return;
    }

    try {
      if (isJsonMode()) {
        // Use JSON API for updates
        await appointmentAPI.updateAppointment(appointmentId, { 
          status,
          updatedAt: new Date().toISOString()
        });
      } else {
        // MongoDB mode with authentication
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: {
              'x-auth-token': token,
            },
          };
          await axios.put(
            `http://localhost:5000/api/staff/appointments/${appointmentId}/status`,
            { status },
            config
          );
        } else {
          // Fallback to JSON server
          await appointmentAPI.updateAppointment(appointmentId, { 
            status,
            updatedAt: new Date().toISOString()
          });
        }
      }
      
      // Update the local state to reflect the change
      setAppointments(
        appointments.map((app) =>
          (app._id || app.id) === appointmentId ? { ...app, status } : app
        )
      );
      alert('Appointment status updated successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to update status.');
    }
  };

  const submitCancel = async () => {
    if (!cancelReason) {
      alert('Cancellation reason is required.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
      const cancelData = {
        status: 'cancelled',
        cancellationReason: cancelReason,
        cancelledBy: 'owner',
        cancelledByName: user.name || 'Owner/Staff',
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isJsonMode()) {
        // Use JSON API for cancellation
        await appointmentAPI.updateAppointment(activeAppId, cancelData);
      } else {
        // MongoDB mode with authentication
        const token = localStorage.getItem('token');
        if (token) {
          const config = {
            headers: {
              'x-auth-token': token,
            },
          };
          await axios.put(
            `http://localhost:5000/api/staff/appointments/${activeAppId}/status`,
            cancelData,
            config
          );
        } else {
          // Fallback to JSON server
          await appointmentAPI.updateAppointment(activeAppId, cancelData);
        }
      }
      
      // Update the local state to reflect the change
      setAppointments(
        appointments.map((app) =>
          (app._id || app.id) === activeAppId ? { ...app, ...cancelData } : app
        )
      );
      setShowCancelModal(false);
      alert('Appointment cancelled successfully!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Failed to cancel appointment.');
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Owner Dashboard</h2>
      <h3>All Appointments</h3>
      {appointments.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
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
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id || app.id}>
                  <td>
                    {app.customer?.name || 'Customer'}
                  </td>
                  <td>
                    {app.service?.name || app.serviceName}
                  </td>
                  <td>
                    {new Date(app.date).toLocaleDateString()}
                  </td>
                  <td>
                    {app.slot}
                  </td>
                  <td>
                    ₹{app.price}
                  </td>
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
                          <div><strong>When:</strong> {new Date(app.cancelledAt).toLocaleString()}</div>
                        )}
                      </div>
                    )}
                    {app.status !== 'cancelled' && '-'}
                  </td>
                  <td>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleUpdateStatus(app._id || app.id, 'confirmed')}
                          className="btn-confirm"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app._id || app.id, 'cancelled')}
                          className="btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {app.status === 'confirmed' && (
                      <button 
                        onClick={() => handleUpdateStatus(app._id || app.id, 'cancelled')}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    )}
                    {(app.status === 'cancelled' || app.status === 'completed') && (
                      <span className="no-actions">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No appointments found.</p>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              Cancel Appointment
            </h3>
            <p className="modal-text">
              Please provide a reason for cancelling this appointment:
            </p>
            <textarea
              rows={4}
              className="modal-textarea"
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div className="modal-buttons">
              <button 
                onClick={submitCancel}
                className="btn-cancel"
              >
                Cancel Appointment
              </button>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;