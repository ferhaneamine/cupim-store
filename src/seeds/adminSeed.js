require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { pool, connectDB } = require('../config/db');
const User = require('../models/User');

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

(async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ characters) in .env first.');
    process.exit(1);
  }

  await connectDB();
  await User.createTable();

  await pool.query("DELETE FROM users WHERE role = 'admin'");

  await User.create({
    name: ADMIN_NAME || 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });

  console.log(`Admin user created: ${ADMIN_EMAIL}`);
  process.exit(0);
})();