import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../../utils/jsonApi';
import { expressAuthAPI } from '../../utils/expressApi';
import { isJsonMode } from '../../utils/apiConfig';
import NetworkTest from '../NetworkTest';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!email || !newPassword || !confirmPassword) {
      setMessage('All fields are required.');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    console.log('Starting password reset for email:', email);
    console.log('API Mode:', isJsonMode() ? 'JSON Server' : 'Express Server');
    
    try {
      if (isJsonMode()) {
        // Use JSON Server (plain text passwords)
        console.log('Using JSON Server API...');
        await userAPI.forgotPasswordJSON(email, newPassword);
        setMessage('Password updated successfully! You can now log in with your new password.');
        setMessageType('success');
      } else {
        // Use Express Server (secure password hashing)
        console.log('Using Express Server API...');
        const response = await expressAuthAPI.forgotPassword(email, newPassword);
        setMessage(response.data.message);
        setMessageType('success');
      }
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Error updating password:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      const errorMessage = err.response?.data?.message || err.message || 'Error updating password. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f8fafc 60%, #ffe5e5 100%)',
    }}>
      <div className="auth-box" style={{
        boxShadow: '0 4px 24px #ff6b6b22',
        borderRadius: 12,
        padding: '1.3rem 1.2rem',
        maxWidth: 350,
        width: '100%',
        background: 'rgba(255,255,255,0.98)',
        position: 'relative',
        border: '1px solid #ffe5e5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <h2 style={{ color: '#ff6b6b', margin: 0, fontWeight: 800, fontSize: 28, letterSpacing: 1 }}>Reset Password</h2>
          <div style={{ color: '#888', fontSize: 15, marginTop: 2 }}>Enter your email and new password</div>
        </div>

        {message && (
          <div className={messageType === 'error' ? 'error-message' : 'success-message'} style={{
            color: messageType === 'error' ? '#dc2626' : '#059669',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="on" style={{ width: '100%' }}>
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#ff6b6b', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Back to Login
            </Link>
          </div>
        </form>

        {/* Temporary debug component */}
        <NetworkTest />
      </div>
    </div>
  );
};

export default ForgotPassword;
