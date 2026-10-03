const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  const exists = await User.findByEmail(email);
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user.id),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findByEmail(email);

  if (user && (await User.matchPassword(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
