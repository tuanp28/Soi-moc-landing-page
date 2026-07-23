const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const orderIds = ['SM-465449', 'SM-996839', 'SM-447834', 'SM-237960', 'SM-950757'];

async function run() {
  await pool.connect();
  console.log("Connected to database. Updating payment method to COD...");

  // 1. Show before status
  const beforeRes = await pool.query(`
    SELECT id, customer_name, payment_method, payment_status, order_status
    FROM orders
    WHERE id = ANY ($1)
  `, [orderIds]);

  console.log("\nBefore Update:");
  beforeRes.rows.forEach(r => {
    console.log(`- ID: ${r.id} | Name: ${r.customer_name} | Method: ${r.payment_method} | Pay Status: ${r.payment_status} | Order Status: ${r.order_status}`);
  });

  // 2. Perform update
  const updateRes = await pool.query(`
    UPDATE orders
    SET payment_method = 'COD'
    WHERE id = ANY ($1)
  `, [orderIds]);

  console.log(`\nUpdated ${updateRes.rowCount} orders.`);

  // 3. Show after status
  const afterRes = await pool.query(`
    SELECT id, customer_name, payment_method, payment_status, order_status
    FROM orders
    WHERE id = ANY ($1)
  `, [orderIds]);

  console.log("\nAfter Update:");
  afterRes.rows.forEach(r => {
    console.log(`- ID: ${r.id} | Name: ${r.customer_name} | Method: ${r.payment_method} | Pay Status: ${r.payment_status} | Order Status: ${r.order_status}`);
  });

  await pool.end();
}

run().catch(console.error);
