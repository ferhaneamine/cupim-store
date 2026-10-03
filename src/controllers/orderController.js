const Order = require('../models/Order');
const Product = require('../models/Product');
const { getShippingCost } = require('../config/shippingPrices');

exports.getOrders = async (req, res) => {
  const { status, limit, offset } = req.query;
  const orders = await Order.findAll({
    status,
    limit: limit ? parseInt(limit) : 20,
    offset: offset ? parseInt(offset) : 0,
  });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
};

exports.createOrder = async (req, res) => {
  const { customerInfo, products, deliveryMethod = 'Home Delivery' } = req.body;

  if (!customerInfo || !customerInfo.wilaya || !Array.isArray(products) || !products.length) {
    return res.status(400).json({ message: 'customerInfo (with wilaya) and products are required' });
  }

  // Shipping is computed server-side from the price table, never trusted from the client
  const shippingCost = getShippingCost(customerInfo.wilaya, deliveryMethod);
  if (shippingCost === null) {
    return res.status(400).json({ message: 'Invalid wilaya or delivery method' });
  }

  // Subtotal is computed from current DB prices
  let subtotal = 0;
  for (const item of products) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    subtotal += Number(product.price) * item.quantity;
  }

  const order = await Order.create({
    customerInfo,
    products,
    deliveryMethod,
    shippingCost,
    totalAmount: subtotal + shippingCost,
  });

  res.status(201).json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const order = await Order.updateStatus(req.params.id, status);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
};
