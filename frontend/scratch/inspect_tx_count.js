const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function main() {
  try {
    const ordersRes = await pool.query("SELECT COUNT(*), xmin::text FROM orders WHERE xmin::text = '2934' GROUP BY xmin::text");
    console.log("Orders with xmin = '2934':", ordersRes.rows);

    const historyRes = await pool.query("SELECT COUNT(*), xmin::text FROM order_status_history WHERE xmin::text = '2934' GROUP BY xmin::text");
    console.log("History with xmin = '2934':", historyRes.rows);

    // Let's also verify that we can fetch the IDs of these orders
    const orderIdsRes = await pool.query("SELECT id, customer_name, created_at FROM orders WHERE xmin::text = '2934'");
    console.log(`\nList of the 35 order IDs:`);
    orderIdsRes.rows.forEach(o => {
      console.log(`- ${o.id} | ${o.customer_name} | ${o.created_at.toISOString()}`);
    });

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await pool.end();
  }
}

main();
