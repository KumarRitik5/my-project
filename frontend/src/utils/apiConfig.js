// API Configuration
// Toggle between different database modes

// Set this to 'json' to use local JSON server, 'mongo' to use MongoDB with Express
export const API_MODE = 'json'; // Change to 'mongo' for secure password hashing

// API URLs
export const API_ENDPOINTS = {
  json: 'http://localhost:5000',           // JSON Server (plain text passwords)
  mongo: 'http://localhost:5000/api'       // Express Server (bcrypt hashed passwords)
};

// Get current API base URL
export const getCurrentApiUrl = () => API_ENDPOINTS[API_MODE];

// Export current mode
export const isJsonMode = () => API_MODE === 'json';
export const isMongoMode = () => API_MODE === 'mongo';

// Security information
export const getSecurityInfo = () => {
  if (isJsonMode()) {
    return {
      mode: 'JSON Server',
      security: 'Low (Development Only)',
      passwordStorage: 'Plain Text',
      port: 5000
    };
  } else {
    return {
      mode: 'Express + MongoDB',
      security: 'High (Production Ready)',
      passwordStorage: 'Bcrypt Hashed',
      port: 5000
    };
  }
};
