
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookAppointmentPage.css';

const BookAppointmentPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [allTimeSlots, setAllTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const navigate = useNavigate();

  // Fetches services when the component loads
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/services');
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Generate time slots based on business hours and service duration
  const generateTimeSlots = (selectedDate, serviceDuration) => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    let startHour, startMinute, endHour, endMinute;
    
    // Define business hours based on day of week
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
      startHour = 9; startMinute = 0;
      endHour = 20; endMinute = 0; // 8:00 PM
    } else if (dayOfWeek === 6) { // Saturday
      startHour = 9; startMinute = 0;
      endHour = 18; endMinute = 0; // 6:00 PM
    } else { // Sunday
      startHour = 10; startMinute = 0;
      endHour = 17; endMinute = 0; // 5:00 PM
    }
    
    // If it's today, adjust start time to current time + 30 minutes buffer
    if (isToday) {
      const currentTime = new Date();
      const bufferTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes buffer
      const currentHour = bufferTime.getHours();
      const currentMinute = bufferTime.getMinutes();
      
      // Round up to next 15-minute interval for cleaner slots
      const roundedMinute = Math.ceil(currentMinute / 15) * 15;
      let adjustedHour = currentHour;
      let adjustedMinute = roundedMinute;
      
      if (adjustedMinute >= 60) {
        adjustedHour += Math.floor(adjustedMinute / 60);
        adjustedMinute = adjustedMinute % 60;
      }
      
      // Use the later of business hours start or current time
      if (adjustedHour > startHour || (adjustedHour === startHour && adjustedMinute > startMinute)) {
        startHour = adjustedHour;
        startMinute = adjustedMinute;
      }
    }
    
    const slots = [];
    const slotDuration = serviceDuration || 60; // Use service duration or default to 60 minutes
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute === 0)
    ) {
      // Calculate end time for this slot
      let endSlotHour = currentHour;
      let endSlotMinute = currentMinute + slotDuration;
      
      if (endSlotMinute >= 60) {
        endSlotHour += Math.floor(endSlotMinute / 60);
        endSlotMinute = endSlotMinute % 60;
      }
      
      // Check if slot end time exceeds business hours
      if (endSlotHour > endHour || (endSlotHour === endHour && endSlotMinute > endMinute)) {
        break;
      }
      
      // Format time strings
      const formatTime = (hour, minute) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        return `${displayHour}:${displayMinute} ${period}`;
      };
      
      const startTime = formatTime(currentHour, currentMinute);
      const endTime = formatTime(endSlotHour, endSlotMinute);
      
      slots.push(`${startTime} - ${endTime}`);
      
      // Move to next slot
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  };

  // Fetch and categorize slots when service or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedService || !selectedDate) {
        setAllTimeSlots([]);
        return;
      }
      setLoadingSlots(true);
      try {
        // Find the selected service to get duration
        const service = services.find(s => (s.id || s._id).toString() === selectedService.toString());
        const serviceDuration = service ? service.duration : 60;
        
        // Generate all possible slots based on business hours and service duration
        const allSlots = generateTimeSlots(selectedDate, serviceDuration);
        
        // Fetch booked slots for this date (all services to avoid conflicts)
        const res = await axios.get(`http://localhost:5000/appointments?date=${selectedDate}`);
        
        // Filter out cancelled appointments and get confirmed/pending slots
        const bookedSlots = res.data
          .filter(app => app.status === 'confirmed' || app.status === 'pending')
          .map(app => app.slot);
        
        // Remove duplicate booked slots
        const uniqueBookedSlots = [...new Set(bookedSlots)];
        
        // Check if the selected date is today
        const isToday = new Date(selectedDate).toDateString() === new Date().toDateString();
        const now = new Date();
        
        // Categorize each slot
        const categorizedSlots = allSlots.map(slot => {
          const isBooked = uniqueBookedSlots.includes(slot);
          let isPast = false;
          
          if (isToday) {
            // Check if this slot time has passed
            const [startTime] = slot.split(' - ');
            const [time, period] = startTime.split(' ');
            const [hours, minutes] = time.split(':');
            
            let slotHour = parseInt(hours);
            if (period === 'PM' && slotHour !== 12) slotHour += 12;
            if (period === 'AM' && slotHour === 12) slotHour = 0;
            
            const slotDateTime = new Date();
            slotDateTime.setHours(slotHour, parseInt(minutes), 0, 0);
            
            // Add 30-minute buffer
            const bufferTime = new Date(now.getTime() + 30 * 60000);
            isPast = slotDateTime <= bufferTime;
          }
          
          return {
            time: slot,
            isBooked,
            isPast,
            isAvailable: !isBooked && !isPast
          };
        });
        
        setAllTimeSlots(categorizedSlots);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setAllTimeSlots([]);
      }
      setLoadingSlots(false);
    };
    fetchSlots();
  }, [selectedService, selectedDate, services]);

  const handleBooking = async (e) => {
    e.preventDefault();
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert('You must be logged in to book an appointment.');
      return;
    }
    
    // Additional validation to ensure user ID is valid
    if (typeof user.id !== 'string' || user.id.trim() === '') {
      alert('Invalid user session. Please log in again.');
      return;
    }

    // Validate selected date is not in the past
    const selectedDateTime = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (selectedDateTime < today) {
      alert('Cannot book appointments for past dates.');
      return;
    }

    // If booking for today, validate the time slot is not in the past
    if (selectedDateTime.toDateString() === new Date().toDateString()) {
      const now = new Date();
      const [startTime] = selectedSlot.split(' - ');
      const [time, period] = startTime.split(' ');
      const [hours, minutes] = time.split(':');
      
      let slotHour = parseInt(hours);
      if (period === 'PM' && slotHour !== 12) slotHour += 12;
      if (period === 'AM' && slotHour === 12) slotHour = 0;
      
      const slotDateTime = new Date();
      slotDateTime.setHours(slotHour, parseInt(minutes), 0, 0);
      
      if (slotDateTime <= now) {
        alert('Cannot book appointments for past time slots. Please select a future time slot.');
        return;
      }
    }
    
    try {
      // Find the selected service details
      const service = services.find(s => (s.id || s._id).toString() === selectedService.toString());
      if (!service) {
        alert('Invalid service selected.');
        return;
      }

      // Double-check slot availability before booking
      const selectedSlotInfo = allTimeSlots.find(slot => slot.time === selectedSlot);
      if (!selectedSlotInfo || !selectedSlotInfo.isAvailable) {
        alert('This time slot is no longer available. Please select a different time slot.');
        setSelectedSlot('');
        return;
      }

      // Additional real-time check
      const res = await axios.get(`http://localhost:5000/appointments?date=${selectedDate}`);
      const existingBookings = res.data.filter(app => 
        (app.status === 'confirmed' || app.status === 'pending') && app.slot === selectedSlot
      );
      
      if (existingBookings.length > 0) {
        alert('This time slot has just been booked by someone else. Please select a different time slot.');
        // Refresh available slots
        setSelectedSlot('');
        return;
      }
      
      const newAppointment = {
        userId: user.id.trim(), // Ensure clean user ID
        serviceId: selectedService,
        serviceName: service.name,
        price: service.price,
        date: selectedDate,
        slot: selectedSlot,
        status: 'pending',
        createdAt: new Date().toISOString(),
        cancellationReason: '',
        cancelledBy: '',
        cancelledAt: ''
      };
      
      console.log('Creating appointment for user:', user.id, 'Appointment data:', newAppointment);
      
      await axios.post('http://localhost:5000/appointments', newAppointment);
      alert('Appointment request sent! Await confirmation from the owner.');
      navigate('/my-appointments');
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response && err.response.status === 400) {
        alert('This time slot is no longer available. Please select a different time slot.');
      } else {
        alert('Booking failed. Please try again.');
      }
    }
  };

  // Helper: get today's date in yyyy-mm-dd
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className='booking-container'>
      <h1>Book an Appointment</h1>
      
      {/* Business Hours Information */}
      <div className="business-hours-info">
        <h3>Business Hours</h3>
        <div className="hours-list">
          <p><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM</p>
          <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
          <p><strong>Sunday:</strong> 10:00 AM - 5:00 PM</p>
        </div>
        <div className="booking-note">
          <strong>Note:</strong> For same-day bookings, only slots starting 30+ minutes from now are available.
        </div>
      </div>

      <form onSubmit={handleBooking}>
        <div className='form-group'>
          <label>Select Service:</label>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} required>
            <option value=''>-- Choose a service --</option>
            {services.map((service) => (
              <option key={service.id || service._id} value={service.id || service._id}>
                {service.name} (₹{service.price}) - {service.duration} minutes
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label>Select Date:</label>
          <input
            type='date'
            value={selectedDate}
            min={getToday()}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Select Time Slot:</label>
          {loadingSlots ? (
            <div className="loading">Loading available slots...</div>
          ) : (
            <div className="time-slot-grid">
              {allTimeSlots.length === 0 && selectedDate && selectedService ? (
                <div className="no-slots-message">
                  No time slots available for this service duration on the selected day.
                </div>
              ) : (
                allTimeSlots.map((slotInfo) => {
                  const isSelected = selectedSlot === slotInfo.time;
                  let className = 'time-slot-item ';
                  let statusText = '';
                  
                  if (slotInfo.isAvailable) {
                    className += isSelected ? 'selected' : 'available';
                    statusText = 'Available';
                  } else if (slotInfo.isBooked) {
                    className += 'booked';
                    statusText = 'Booked';
                  } else if (slotInfo.isPast) {
                    className += 'past';
                    statusText = 'Past';
                  }
                  
                  return (
                    <div
                      key={slotInfo.time}
                      onClick={() => slotInfo.isAvailable ? setSelectedSlot(slotInfo.time) : null}
                      className={className}
                      title={slotInfo.isAvailable ? 'Click to select this time slot' : 
                             slotInfo.isBooked ? 'This time slot is already booked' : 
                             'This time slot is no longer available'}
                    >
                      <div className="time-slot-time">{slotInfo.time}</div>
                      <div className="time-slot-status">
                        {statusText}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          
          {/* Legend for slot status */}
          {allTimeSlots.length > 0 && (
            <div className="time-slot-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderColor: '#dee2e6'
                }}></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderColor: '#6c757d',
                  opacity: 0.6
                }}></div>
                <span>Booked</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderColor: '#6c757d',
                  opacity: 0.5
                }}></div>
                <span>Past</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ 
                  backgroundColor: '#007bff', 
                  borderColor: '#007bff'
                }}></div>
                <span>Selected</span>
              </div>
            </div>
          )}
        </div>
        <button type='submit' disabled={!selectedService || !selectedDate || !selectedSlot || 
          (allTimeSlots.length > 0 && !allTimeSlots.find(slot => slot.time === selectedSlot && slot.isAvailable))}>
          {selectedSlot && allTimeSlots.find(slot => slot.time === selectedSlot && !slot.isAvailable) 
            ? 'Selected Slot Not Available' 
            : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentPage;