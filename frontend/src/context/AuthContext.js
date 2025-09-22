import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create and export the context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Check user in json-server
      const response = await axios.get(`http://localhost:5000/users?email=${email}`);
      const user = response.data[0];
      
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Don't store sensitive data in state or localStorage
      const userToStore = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      };

      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
      return userToStore;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Check if user already exists
      const existingUser = await axios.get(`http://localhost:5000/users?email=${userData.email}`);
      if (existingUser.data.length > 0) {
        throw new Error('User already exists');
      }

      // Create new user (role can be 'user' or 'owner')
      const response = await axios.post('http://localhost:5000/users', {
        ...userData,
        createdAt: new Date().toISOString()
      });

      const newUser = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role || 'user'
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };



  // Deactivate account function
  const deactivateAccount = async () => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, { active: false });
      logout();
      alert('Your account has been deactivated.');
    } catch (err) {
      alert('Failed to deactivate account.');
    }
  };

  // Permanently delete account
  const deleteAccount = async () => {
    if (!user) return;
    try {
      await axios.delete(`http://localhost:5000/users/${user.id}`);
      logout();
      alert('Your account has been permanently deleted.');
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    deactivateAccount,
    deleteAccount,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
