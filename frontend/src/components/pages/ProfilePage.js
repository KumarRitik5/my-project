import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';


const ProfilePage = () => {
  const { user, deactivateAccount, deleteAccount, logout } = useAuth();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Permanently delete account
  const handleDeleteAccount = async () => {
    await deleteAccount();
    setShowDeactivateModal(false);
    setDeleteConfirm(false);
  };

  if (!user) return <div className="profile-loading">Please log in to view your profile.</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-header">My Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || 'Customer'}</p>
        <p><strong>Status:</strong> <span className={`profile-status ${user.active === false ? 'inactive' : 'active'}`}>{user.active === false ? 'Deactivated' : 'Active'}</span></p>
      </div>
      <div className="profile-actions">
        <button
          onClick={() => setShowDeactivateModal(true)}
          className="profile-button danger"
        >
          Deactivate / Delete Account
        </button>
        <button
          onClick={logout}
          className="profile-button warning"
        >
          Logout
        </button>
      </div>

      {/* Deactivate/Delete Modal */}
      {showDeactivateModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h2>Account Action</h2>
            <p>Please let us know why you want to deactivate or delete your account:</p>
            <textarea
              rows={3}
              placeholder="Reason (optional, helps us improve)"
              value={deactivateReason}
              onChange={e => setDeactivateReason(e.target.value)}
            />
            {!deleteConfirm ? (
              <div className="profile-modal-actions">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate by contacting support.')) {
                      deactivateAccount();
                      setShowDeactivateModal(false);
                    }
                  }}
                  className="profile-modal-button warning"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="profile-modal-button danger"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="profile-modal-button secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="profile-modal-actions">
                <p className="delete-warning">Are you sure? This action cannot be undone.</p>
                <button
                  onClick={handleDeleteAccount}
                  className="profile-modal-button danger"
                >
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="profile-modal-button secondary"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
