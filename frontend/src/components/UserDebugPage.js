import React from 'react';

const UserDebugPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Debug Information</h2>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>Current User in localStorage:</h3>
        <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        <h3>User ID Check:</h3>
        <p><strong>User exists:</strong> {user ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
        <p><strong>User ID type:</strong> {typeof user?.id || 'undefined'}</p>
        <p><strong>User name:</strong> {user?.name || 'None'}</p>
        <p><strong>User role:</strong> {user?.role || 'None'}</p>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default UserDebugPage;
