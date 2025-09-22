import axios from 'axios';

// JSON Server Configuration
const JSON_API_BASE = 'http://localhost:5000';

// Create axios instance for JSON server
const jsonApi = axios.create({
  baseURL: JSON_API_BASE,
});

// Utility functions to interact with JSON server

// Users API
export const userAPI = {
  // Get all users
  getUsers: () => jsonApi.get('/users'),
  
  // Get user by ID
  getUser: (id) => jsonApi.get(`/users/${id}`),
  
  // Create new user
  createUser: (userData) => {
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 4), // Generate random ID
      createdAt: new Date().toISOString()
    };
    return jsonApi.post('/users', newUser);
  },
  
  // Update user
  updateUser: (id, userData) => {
    console.log('Updating user:', id, userData);
    return jsonApi.put(`/users/${id}`, userData);
  },
  
  // Delete user
  deleteUser: (id) => jsonApi.delete(`/users/${id}`),
  
  // Login - find user by email and password
  login: async (email, password) => {
    try {
      const response = await jsonApi.get(`/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        return { data: response.data[0] };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Forgot Password (JSON Server version - plain text)
  forgotPasswordJSON: async (email, newPassword) => {
    try {
      console.log('forgotPasswordJSON called with:', { email, newPassword });
      console.log('JSON API Base URL:', JSON_API_BASE);
      
      // Find user by email
      console.log('Searching for user with email:', email);
      const response = await jsonApi.get(`/users?email=${email}`);
      console.log('User search response:', response.data);
      
      if (response.data.length === 0) {
        throw new Error('No user found with this email address');
      }
      
      const user = response.data[0];
      console.log('Found user:', user);
      
      // Update password (plain text for JSON server)
      const updatedUser = { ...user, password: newPassword };
      console.log('Updating user with new password:', updatedUser);
      
      const updateResponse = await jsonApi.put(`/users/${user.id}`, updatedUser);
      console.log('Update response:', updateResponse.data);
      
      return { message: 'Password updated successfully! You can now log in with your new password.' };
    } catch (error) {
      console.error('forgotPasswordJSON error:', error);
      throw error;
    }
  }
};

// Services API
export const serviceAPI = {
  // Get all services
  getServices: () => jsonApi.get('/services'),
  
  // Get service by ID
  getService: (id) => jsonApi.get(`/services/${id}`),
  
  // Create new service
  createService: (serviceData) => {
    const newService = {
      ...serviceData,
      id: Math.random().toString(36).substr(2, 4)
    };
    return jsonApi.post('/services', newService);
  },
  
  // Update service
  updateService: (id, serviceData) => jsonApi.put(`/services/${id}`, serviceData),
  
  // Delete service
  deleteService: (id) => jsonApi.delete(`/services/${id}`)
};

// Appointments API
export const appointmentAPI = {
  // Get all appointments
  getAppointments: () => jsonApi.get('/appointments'),
  
  // Get appointments by user ID
  getUserAppointments: (userId) => jsonApi.get(`/appointments?userId=${userId}`),
  
  // Get appointment by ID
  getAppointment: (id) => jsonApi.get(`/appointments/${id}`),
  
  // Create new appointment
  createAppointment: (appointmentData) => {
    const newAppointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 4),
      status: 'pending',
      createdAt: new Date().toISOString(),
      cancellationReason: '',
      cancelledBy: '',
      cancelledAt: ''
    };
    return jsonApi.post('/appointments', newAppointment);
  },
  
  // Update appointment
  updateAppointment: (id, appointmentData) => {
    const updateData = {
      ...appointmentData,
      updatedAt: new Date().toISOString()
    };
    return jsonApi.put(`/appointments/${id}`, updateData);
  },
  
  // Cancel appointment
  cancelAppointment: (id, cancellationData) => {
    const updateData = {
      ...cancellationData,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return jsonApi.patch(`/appointments/${id}`, updateData);
  },
  
  // Delete appointment
  deleteAppointment: (id) => jsonApi.delete(`/appointments/${id}`)
};

// Notifications API
export const notificationAPI = {
  // Get all notifications
  getNotifications: () => jsonApi.get('/notifications'),
  
  // Get notifications by user ID
  getUserNotifications: (userId) => jsonApi.get(`/notifications?userId=${userId}`),
  
  // Create new notification
  createNotification: (notificationData) => {
    const newNotification = {
      ...notificationData,
      id: Math.random().toString(36).substr(2, 4),
      isRead: false
    };
    return jsonApi.post('/notifications', newNotification);
  },
  
  // Mark notification as read
  markAsRead: (id, readData) => {
    const updateData = {
      ...readData,
      isRead: true,
      readAt: new Date().toISOString()
    };
    return jsonApi.patch(`/notifications/${id}`, updateData);
  },
  
  // Delete notification
  deleteNotification: (id) => jsonApi.delete(`/notifications/${id}`)
};

// Home Page Config API
export const homePageAPI = {
  // Get home page configuration
  getConfig: () => jsonApi.get('/homePageConfig'),
  
  // Update home page configuration
  updateConfig: (configData) => {
    const updateData = {
      ...configData,
      lastUpdated: new Date().toISOString()
    };
    return jsonApi.put('/homePageConfig', updateData);
  }
};

// Export the main API instance as well
export default jsonApi;
