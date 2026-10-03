require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { connectDB } = require('../config/db');
const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');
const Order    = require('../models/Order');

(async () => {
  await connectDB();

  console.log('Creating tables...');
  await User.createTable();
  console.log('✓ users');
  await Category.createTable();
  console.log('✓ categories');
  await Product.createTable();
  console.log('✓ products');
  await Order.createTables();
  console.log('✓ orders + order_items');

  console.log('\nAll tables created successfully.');
  process.exit(0);
})();
