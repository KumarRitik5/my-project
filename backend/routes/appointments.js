const express = require('express');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const router = express.Router();

// @route   GET /api/appointments
// @desc    Get a user's appointments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id })
      .populate('service', 'name duration'); // Populates service details
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/', auth, async (req, res) => {
  const { service, date, slot } = req.body;

  try {
    // Check for existing appointments for the chosen slot
    const existingAppointment = await Appointment.findOne({ date, slot });
    if (existingAppointment) {
      return res.status(400).json({ msg: 'This slot is already booked' });
    }

    const newAppointment = new Appointment({
      customer: req.user.id,
      service,
      date,
      slot,
    });
    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update an appointment (e.g., cancel it)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Ensure the user owns the appointment or is an admin
    if (appointment.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
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