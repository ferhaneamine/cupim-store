const { pool } = require('../config/db');

const createTables = async () => {
  // Main orders table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL PRIMARY KEY,
      order_number    VARCHAR(50)  UNIQUE NOT NULL,
      full_name       VARCHAR(150) NOT NULL,
      phone           VARCHAR(30)  NOT NULL,
      secondary_phone VARCHAR(30),
      email           VARCHAR(150),
      wilaya          VARCHAR(100),
      city            VARCHAR(100),
      address         TEXT,
      postal_code     VARCHAR(20),
      delivery_method VARCHAR(50)  NOT NULL
                      CHECK (delivery_method IN ('Home Delivery','Post Office Delivery')),
      shipping_cost   NUMERIC(10,2) DEFAULT 0,
      total_amount    NUMERIC(10,2) NOT NULL,
      status          VARCHAR(30)  NOT NULL DEFAULT 'Pending'
                      CHECK (status IN ('Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled')),
      created_at      TIMESTAMP DEFAULT NOW(),
      updated_at      TIMESTAMP DEFAULT NOW()
    )
  `);

  // Order items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id         SERIAL PRIMARY KEY,
      order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      size       VARCHAR(50),
      quantity   INTEGER NOT NULL DEFAULT 1
    )
  `);
};

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const findAll = async ({ status, limit = 20, offset = 0 } = {}) => {
  let query = `
    SELECT o.*,
      json_agg(
        json_build_object(
          'product_id', oi.product_id,
          'size',       oi.size,
          'quantity',   oi.quantity,
          'title',      p.title,
          'price',      p.price
        )
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
  `;
  const params = [];

  if (status) {
    params.push(status);
    query += ` WHERE o.status = $${params.length}`;
  }

  params.push(limit, offset);
  query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows } = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const { rows: orderRows } = await pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );
  if (!orderRows[0]) return null;

  const { rows: items } = await pool.query(
    `SELECT oi.*, p.title, p.price
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  return { ...orderRows[0], items };
};

const create = async ({ customerInfo, products, deliveryMethod, shippingCost, totalAmount }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = generateOrderNumber();

   const { rows: orderRows } = await client.query(
  `INSERT INTO orders
    (order_number, full_name, phone, secondary_phone, email,
     wilaya, city, address, postal_code, delivery_method, shipping_cost, total_amount)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
   RETURNING *`,
  [
    orderNumber,
    customerInfo.fullName,
    customerInfo.phone,
    customerInfo.secondaryPhone,
    customerInfo.email,
    customerInfo.wilaya,
    customerInfo.city,
    customerInfo.address,
    customerInfo.postalCode,
    deliveryMethod,
    shippingCost,
    totalAmount,
  ]
);

    const order = orderRows[0];

    for (const item of products) {
  await client.query(
    `INSERT INTO order_items (order_id, product_id, size, quantity)
     VALUES ($1, $2, $3, $4)`,
    [order.id, item.product, item.size, item.quantity]
  );

  await client.query(
    `UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2`,
    [item.quantity, item.product]
  );
}

    await client.query('COMMIT');
    return findById(order.id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const updateStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE orders SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0] || null;
};

module.exports = { createTables, findAll, findById, create, updateStatus };
