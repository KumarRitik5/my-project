
const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/staff/appointments
// @desc    View all appointments (admin/staff only)
// @access  Private
router.get('/appointments', auth, async (req, res) => {
  // Check if the user is an admin or staff member
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ msg: 'Authorization denied' });
  }

  try {
    const appointments = await Appointment.find()
      .populate('customer', 'name email') // Get customer details
      .populate('service', 'name price'); // Get service details
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/staff/appointments/:id/status
// @desc    Update an appointment's status (e.g., confirm or cancel)
// @access  Private
router.put('/appointments/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ msg: 'Authorization denied' });
  }

  const { status } = req.body;
  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status provided' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;