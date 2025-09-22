import React from 'react';

const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
    <h1 style={{ fontSize: '3rem', color: '#ff6b6b', marginBottom: '1rem' }}>404</h1>
    <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>Page Not Found</h2>
    <p style={{ color: '#666', fontSize: '1.1rem' }}>
      Sorry, the page you are looking for does not exist.<br />
      Please check the URL or return to the <a href="/">home page</a>.
    </p>
  </div>
);

export default NotFoundPage;
