const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { success, error } = require('../utils/responseHelper');

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 400, 'Email and password are required.');
    }

    // Explicitly select password (it's hidden by default in the schema)
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      return error(res, 401, 'Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password.');
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return success(res, 200, 'Login successful.', {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
const getMe = (req, res) => {
  // req.admin is set by authMiddleware
  return success(res, 200, 'Admin profile fetched.', {
    id:    req.admin._id,
    name:  req.admin.name,
    email: req.admin.email,
  });
};

module.exports = { login, getMe };
