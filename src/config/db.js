const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(`PostgreSQL Connected: ${client.host || 'localhost'}`);
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
