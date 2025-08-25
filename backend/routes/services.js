const express = require('express');
const auth = require('../middleware/auth');
const Service = require('../models/Service');

const router = express.Router();

// @route   GET /api/services
// @desc    Fetch all available services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Add a new service (admin only)
// @access  Private
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Authorization denied: Admin access required' });
  }
  const { name, duration, price } = req.body;
  try {
    const newService = new Service({ name, duration, price });
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;