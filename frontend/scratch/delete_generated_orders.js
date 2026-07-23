const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const TARGET_TXID = '2934';

async function run() {
  await pool.connect();
  console.log("Connected to database. Initializing deletion...");

  // 1. Check counts before deletion
  const beforeOrders = await pool.query("SELECT COUNT(*) FROM orders");
  const beforeHistory = await pool.query("SELECT COUNT(*) FROM order_status_history");
  
  const targetOrdersCount = await pool.query("SELECT COUNT(*) FROM orders WHERE xmin::text = $1", [TARGET_TXID]);
  const targetHistoryCount = await pool.query("SELECT COUNT(*) FROM order_status_history WHERE xmin::text = $1", [TARGET_TXID]);

  console.log(`\nBefore Deletion:`);
  console.log(`- Total orders in DB: ${beforeOrders.rows[0].count}`);
  console.log(`- Total history records in DB: ${beforeHistory.rows[0].count}`);
  console.log(`- Target orders to delete (xmin = '${TARGET_TXID}'): ${targetOrdersCount.rows[0].count}`);
  console.log(`- Target history records to delete (xmin = '${TARGET_TXID}'): ${targetHistoryCount.rows[0].count}`);

  if (parseInt(targetOrdersCount.rows[0].count) === 0 && parseInt(targetHistoryCount.rows[0].count) === 0) {
    console.log("\nNo target records found to delete. Transaction might have already been cleaned up.");
    await pool.end();
    return;
  }

  // 2. Perform deletion in a transaction
  console.log("\nStarting transaction for deletion...");
  await pool.query('BEGIN');
  try {
    const deletedHistory = await pool.query("DELETE FROM order_status_history WHERE xmin::text = $1", [TARGET_TXID]);
    console.log(`Deleted ${deletedHistory.rowCount} order status history records.`);

    const deletedOrders = await pool.query("DELETE FROM orders WHERE xmin::text = $1", [TARGET_TXID]);
    console.log(`Deleted ${deletedOrders.rowCount} order records.`);

    await pool.query('COMMIT');
    console.log("Successfully committed deletion transaction!");
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("Deletion failed, transaction rolled back:", err);
    throw err;
  }

  // 3. Check counts after deletion
  const afterOrders = await pool.query("SELECT COUNT(*) FROM orders");
  const afterHistory = await pool.query("SELECT COUNT(*) FROM order_status_history");

  console.log(`\nAfter Deletion:`);
  console.log(`- Total orders in DB: ${afterOrders.rows[0].count}`);
  console.log(`- Total history records in DB: ${afterHistory.rows[0].count}`);

  await pool.end();
}

run().catch(console.error);
