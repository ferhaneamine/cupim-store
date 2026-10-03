const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { category_id, limit, offset } = req.query;
  const products = await Product.findAll({
    category_id: category_id ? parseInt(category_id) : undefined,
    limit: limit ? parseInt(limit) : 20,
    offset: offset ? parseInt(offset) : 0,
  });
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { title, description, price, images, sizes, stock, category_id, material, weight, sku } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({ message: 'Title, description and price are required' });
  }

  const product = await Product.create({
    title, description, price, images, sizes,
    stock, category_id, material, weight, sku,
  });

  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.update(req.params.id, req.body);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.remove(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product deleted' });
};
