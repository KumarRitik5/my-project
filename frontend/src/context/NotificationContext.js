import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check for new notifications every 30 seconds
  useEffect(() => {
    const checkNotifications = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        // Fetch both appointments and notification read status
        const [appointmentsRes, notificationsRes] = await Promise.all([
          axios.get('http://localhost:5000/appointments'),
          axios.get('http://localhost:5000/notifications')
        ]);
        
        const allAppointments = appointmentsRes.data.filter(app => app.id);
        const readNotifications = notificationsRes.data.filter(n => n.userId === user.id);
        
        let userNotifications = [];
        
        if (user.role === 'owner' || user.role === 'admin') {
          // Owner notifications: pending appointments
          const pendingAppointments = allAppointments.filter(app => app.status === 'pending');
          userNotifications = pendingAppointments.map(app => {
            const notificationId = `pending-${app.id}`;
            const readNotif = readNotifications.find(n => n.notificationId === notificationId);
            return {
              id: notificationId,
              type: 'appointment_request',
              title: 'New Appointment Request',
              message: `${app.serviceName} - ${app.date} ${app.slot}`,
              timestamp: app.createdAt,
              appointmentId: app.id,
              isRead: readNotif ? readNotif.isRead : false
            };
          });
        } else {
          // Customer notifications: status changes for their appointments
          const userAppointments = allAppointments.filter(app => app.userId === user.id);
          userNotifications = userAppointments
            .filter(app => app.status === 'confirmed' || app.status === 'cancelled')
            .map(app => {
              const notificationId = `status-${app.id}`;
              const readNotif = readNotifications.find(n => n.notificationId === notificationId);
              return {
                id: notificationId,
                type: app.status === 'confirmed' ? 'appointment_confirmed' : 'appointment_cancelled',
                title: app.status === 'confirmed' ? 'Appointment Confirmed' : 'Appointment Cancelled',
                message: `${app.serviceName} - ${app.date} ${app.slot}`,
                timestamp: app.updatedAt || app.createdAt,
                appointmentId: app.id,
                isRead: readNotif ? readNotif.isRead : false,
                reason: app.status === 'cancelled' ? app.cancellationReason : null
              };
            });
        }

        // Sort by timestamp (newest first)
        userNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.isRead).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      // Check if notification read status exists
      const existingRes = await axios.get(`http://localhost:5000/notifications?userId=${user.id}&notificationId=${notificationId}`);
      
      if (existingRes.data.length > 0) {
        // Update existing
        await axios.patch(`http://localhost:5000/notifications/${existingRes.data[0].id}`, {
          isRead: true,
          readAt: new Date().toISOString()
        });
      } else {
        // Create new
        await axios.post('http://localhost:5000/notifications', {
          userId: user.id,
          notificationId: notificationId,
          isRead: true,
          readAt: new Date().toISOString()
        });
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        try {
          const existingRes = await axios.get(`http://localhost:5000/notifications?userId=${user.id}&notificationId=${notification.id}`);
          
          if (existingRes.data.length > 0) {
            await axios.patch(`http://localhost:5000/notifications/${existingRes.data[0].id}`, {
              isRead: true,
              readAt: new Date().toISOString()
            });
          } else {
            await axios.post('http://localhost:5000/notifications', {
              userId: user.id,
              notificationId: notification.id,
              isRead: true,
              readAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error(`Error marking notification ${notification.id} as read:`, err);
        }
      }

      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showNotifications,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        toggleNotifications,
        setShowNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
