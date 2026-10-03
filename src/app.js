const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const { SHIPPING_PRICES } = require('./config/shippingPrices');

connectDB();

const app = express();
app.use((req, res, next) => {
  if (req.url.endsWith('.mov') || req.url.endsWith('.mp4')) {
    res.setHeader('Accept-Ranges', 'bytes');
  }
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ origin: '*' }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/shipping-prices', (req, res) => res.json(SHIPPING_PRICES));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../cupim-frontend')));
app.use(errorHandler);

module.exports = app;
