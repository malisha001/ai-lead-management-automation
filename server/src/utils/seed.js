/**
 * Seed script — creates the initial admin user.
 * Run once: node src/utils/seed.js
 */
require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const Admin    = require('../models/Admin');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const existing = await Admin.findOne({ email: 'admin@leadmanager.com' });
    if (existing) {
      console.log('ℹ️  Admin already exists — skipping seed.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@1234', 12);
    await Admin.create({
      name:     'Admin',
      email:    'admin@leadmanager.com',
      password: hashedPassword,
    });

    console.log('🌱 Admin seeded successfully!');
    console.log('   Email:    admin@leadmanager.com');
    console.log('   Password: Admin@1234');
    console.log('   ⚠️  Change this password after first login!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
