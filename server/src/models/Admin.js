const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required.'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required.'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email.'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select:    false, // Never returned in queries by default
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
