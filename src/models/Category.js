const { pool } = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      description TEXT,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    )
  `);
};

const findAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM categories ORDER BY created_at DESC'
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, description }) => {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );
  return rows[0];
};

const update = async (id, { name, description }) => {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [name, description, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

module.exports = { createTable, findAll, findById, create, update, remove };
