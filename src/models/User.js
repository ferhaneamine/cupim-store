const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      name      VARCHAR(100)  NOT NULL,
      email     VARCHAR(150)  UNIQUE NOT NULL,
      password  VARCHAR(255)  NOT NULL,
      role      VARCHAR(20)   NOT NULL DEFAULT 'customer'
                              CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

const findByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, email, password, role = 'customer' }) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, hashed, role]
  );
  return rows[0];
};

const matchPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { createTable, findByEmail, findById, create, matchPassword };
