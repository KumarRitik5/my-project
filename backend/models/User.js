const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(v) {
        // Only allow letters and spaces, no numbers at all
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'Name can only contain letters and spaces (no numbers allowed)'
    },
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Only allow exactly 10 digits, no characters or special symbols
        return /^\d{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits (numbers only)'
    },
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'staff', 'admin', 'owner', 'user'],
    default: 'customer',
  },
});

module.exports = mongoose.model('User', UserSchema);