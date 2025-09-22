import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Star icon for feedback
const Star = ({ filled }) => (
  <span style={{ color: filled ? '#FFD700' : '#ccc', fontSize: '1.2em' }}>★</span>
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
      setAppointments(appsRes.data.filter(app => app.id)); // Filter out empty objects
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
      await axios.patch(`http://localhost:5000/appointments/${id}`, { status });
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
        cancelledAt: new Date().toISOString()
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

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '2rem', background: '#fffbe6', borderRadius: 16, boxShadow: '0 2px 16px #ffecb366' }}>
      <h2 style={{ textAlign: 'center', color: '#ff6b6b', marginBottom: 32 }}>Owner Dashboard</h2>
      
      <h3 style={{ color: '#333', marginBottom: 16 }}>All Appointments</h3>
      
      {/* Service Ratings Section */}
      <div style={{ marginBottom: 24, background: '#f7f7f7', borderRadius: 8, padding: 16, boxShadow: '0 1px 6px #ffecb322' }}>
        <h4 style={{ margin: 0, color: '#ff6b6b' }}>Service Ratings & Feedback</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 10 }}>
          {services.map(service => {
            const avg = getServiceRating(service.id || service._id);
            const feedbacks = getServiceFeedbacks(service.id || service._id);
            return (
              <div key={service.id || service._id} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #ffecb322', padding: 12, minWidth: 180 }}>
                <div style={{ fontWeight: 600 }}>{service.name}</div>
                <div style={{ margin: '4px 0' }}>
                  <span style={{ fontWeight: 500 }}>Avg Rating: </span>
                  {avg ? (
                    <span style={{ color: '#FFD700', fontWeight: 700 }}>{avg} / 5</span>
                  ) : (
                    <span style={{ color: '#aaa' }}>No ratings</span>
                  )}
                </div>
                <button onClick={() => { setFeedbackService(service); setShowFeedbackModal(true); }} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>View Feedbacks</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointments Table */}
      <div style={{ overflowX: 'auto', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8 }}>
          <thead>
            <tr style={{ background: '#ffe5e5' }}>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Customer</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Service</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Slot</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Cancellation Info</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>No appointments found.</td></tr>
            ) : (
              appointments.map((app) => {
                const statusColor = app.status === 'cancelled' ? '#ff3333' : app.status === 'completed' ? '#00875a' : app.status === 'confirmed' ? '#1976d2' : '#ffb300';
                const user = users.find(u => u.id === app.userId);
                
                return (
                  <tr key={app.id || app._id}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {user ? user.name : app.userId}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{app.serviceName}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{app.date}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{app.slot}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>₹{app.price}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      <span style={{
                        background: statusColor + '22',
                        color: statusColor,
                        fontWeight: 700,
                        borderRadius: 6,
                        padding: '0.3em 0.8em',
                        fontSize: '0.9em',
                        textTransform: 'capitalize',
                        letterSpacing: 1
                      }}>{app.status}</span>
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
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
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {app.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'confirmed')}
                            style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                          >Confirm</button>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'cancelled')}
                            style={{ background: '#ff3333', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                          >Cancel</button>
                        </div>
                      )}
                      {app.status === 'confirmed' && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'completed')}
                            style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                          >Complete</button>
                          <button
                            onClick={() => handleUpdateStatus(app.id || app._id, 'cancelled')}
                            style={{ background: '#ff3333', color: 'white', border: 'none', borderRadius: 4, padding: '0.3rem 0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                          >Cancel</button>
                        </div>
                      )}
                      {(app.status === 'cancelled' || app.status === 'completed') && (
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>No actions</span>
                      )}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                      {app.stars && (
                        <div>{[...Array(5)].map((_, i) => <Star key={i} filled={i < app.stars} />)}</div>
                      )}
                      {app.feedback && (
                        <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{app.feedback}</div>
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
      <h3 style={{ color: '#333', marginBottom: 16 }}>Manage Services</h3>
      <button onClick={() => { setShowServiceForm(true); setEditServiceId(null); setServiceForm({ name: '', price: '', duration: '', description: '' }); }} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>Add New Service</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {services.map(service => (
          <div key={service.id || service._id} style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 8px #ffecb366', padding: 18, marginBottom: 10 }}>
            <h4 style={{ color: '#ff6b6b', marginBottom: 8 }}>{service.name}</h4>
            <div style={{ color: '#666', marginBottom: 8 }}>{service.description}</div>
            <div style={{ marginBottom: 8 }}>Price: <b>₹{service.price}</b></div>
            <div style={{ marginBottom: 8 }}>Duration: {service.duration} min</div>
            <button onClick={() => handleEditService(service)} style={{ background: '#ffb300', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Edit</button>
            <button onClick={() => handleDeleteService(service.id || service._id)} style={{ background: '#ff3333', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem', minWidth: 400, boxShadow: '0 4px 32px #0002' }}>
            <h3 style={{ color: '#ff3333', marginBottom: 16, textAlign: 'center' }}>Cancel Appointment</h3>
            <p style={{ marginBottom: 16, color: '#666' }}>Please provide a reason for cancelling this appointment:</p>
            <textarea
              rows={4}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 8, marginBottom: 16, resize: 'vertical' }}
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={submitCancel} style={{ background: '#ff3333', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Cancel Appointment</button>
              <button onClick={() => setShowCancelModal(false)} style={{ background: '#666', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={editServiceId ? handleUpdateService : handleAddService} style={{ background: 'white', borderRadius: 12, padding: '2rem', minWidth: 320, boxShadow: '0 4px 32px #0002', textAlign: 'center' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: 16 }}>{editServiceId ? 'Edit Service' : 'Add New Service'}</h2>
            <input name="name" value={serviceForm.name} onChange={handleServiceFormChange} placeholder="Service Name" required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <input name="price" value={serviceForm.price} onChange={handleServiceFormChange} placeholder="Price" type="number" min="0" required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <input name="duration" value={serviceForm.duration} onChange={handleServiceFormChange} placeholder="Duration (min)" type="number" min="1" required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <textarea name="description" value={serviceForm.description} onChange={handleServiceFormChange} placeholder="Description" rows={3} style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>{editServiceId ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => { setShowServiceForm(false); setEditServiceId(null); }} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Feedback Modal for Service */}
      {showFeedbackModal && feedbackService && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '2rem', minWidth: 320, maxWidth: 500, boxShadow: '0 4px 32px #0002', textAlign: 'center' }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: 16 }}>Feedback for {feedbackService.name}</h2>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
              {getServiceFeedbacks(feedbackService.id || feedbackService._id).length === 0 ? (
                <div style={{ color: '#aaa' }}>No feedbacks yet.</div>
              ) : (
                getServiceFeedbacks(feedbackService.id || feedbackService._id).map((fb, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #eee', marginBottom: 10, paddingBottom: 8, textAlign: 'left' }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{users.find(u => u.id === fb.userId)?.name || fb.userId}</div>
                    <div style={{ marginBottom: 2 }}>{[...Array(5)].map((_, i) => <Star key={i} filled={i < (fb.stars || 0)} />)}</div>
                    <div style={{ color: '#555' }}>{fb.feedback}</div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => { setShowFeedbackModal(false); setFeedbackService(null); }} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '0.5rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
