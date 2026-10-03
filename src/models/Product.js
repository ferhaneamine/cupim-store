const { pool } = require('../config/db');

const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(200)   NOT NULL,
      description TEXT           NOT NULL,
      price       NUMERIC(10,2)  NOT NULL,
      images      TEXT[]         DEFAULT '{}',
      sizes       TEXT[]         DEFAULT '{}',
      stock       INTEGER        DEFAULT 0,
      category_id INTEGER        REFERENCES categories(id) ON DELETE SET NULL,
      material    VARCHAR(100),
      weight      NUMERIC(8,2),
      sku         VARCHAR(100)   UNIQUE,
      created_at  TIMESTAMP DEFAULT NOW(),
      updated_at  TIMESTAMP DEFAULT NOW()
    )
  `);
};

const findAll = async ({ category_id, limit = 20, offset = 0 } = {}) => {
  let query = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  const params = [];

  if (category_id) {
    params.push(category_id);
    query += ` WHERE p.category_id = $${params.length}`;
  }

  params.push(limit, offset);
  query += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows } = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ title, description, price, images, sizes, stock, category_id, material, weight, sku }) => {
  const { rows } = await pool.query(
    `INSERT INTO products
      (title, description, price, images, sizes, stock, category_id, material, weight, sku)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    [title, description, price, images || [], sizes || [], stock || 0, category_id, material, weight, sku]
  );
  return rows[0];
};

const update = async (id, fields) => {
  const { title, description, price, images, sizes, stock, category_id, material, weight, sku } = fields;
  const { rows } = await pool.query(
    `UPDATE products SET
       title       = COALESCE($1,  title),
       description = COALESCE($2,  description),
       price       = COALESCE($3,  price),
       images      = COALESCE($4,  images),
       sizes       = COALESCE($5,  sizes),
       stock       = COALESCE($6,  stock),
       category_id = COALESCE($7,  category_id),
       material    = COALESCE($8,  material),
       weight      = COALESCE($9,  weight),
       sku         = COALESCE($10, sku),
       updated_at  = NOW()
     WHERE id = $11
     RETURNING *`,
    [title, description, price, images, sizes, stock, category_id, material, weight, sku, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query(
    'DELETE FROM products WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

module.exports = { createTable, findAll, findById, create, update, remove };
