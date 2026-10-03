const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const category = await Category.create({ name, description });
  res.status(201).json(category);
};

exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.update(req.params.id, { name, description });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.remove(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json({ message: 'Category deleted' });
};
