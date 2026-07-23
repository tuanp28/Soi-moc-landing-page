const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const orderIds = ['SM-849014', 'SM-997965', 'SM-840784', 'SM-547718', 'SM-588966'];

async function main() {
  try {
    const totalOrdersRes = await pool.query("SELECT COUNT(*) FROM orders");
    console.log(`Total orders in DB now: ${totalOrdersRes.rows[0].count}`);

    const targetOrdersRes = await pool.query(`
      SELECT id, customer_name, total_amount, payment_method, payment_status, order_status, created_at
      FROM orders
      WHERE id = ANY ($1)
      ORDER BY created_at ASC
    `, [orderIds]);

    console.log(`\nVerification of the 5 inserted orders (Batch 4):`);
    for (const row of targetOrdersRes.rows) {
      console.log(`- ID: ${row.id} | Name: ${row.customer_name} | Total: ${row.total_amount} VND | Method: ${row.payment_method} | Created (Local): ${row.created_at.toLocaleString('vi-VN')}`);
      
      const historyRes = await pool.query(`
        SELECT status, changed_by, changed_at, note
        FROM order_status_history
        WHERE order_id = $1
        ORDER BY changed_at ASC
      `, [row.id]);
      
      console.log(`  History transitions:`);
      historyRes.rows.forEach(h => {
        console.log(`    * [${h.changed_at.toLocaleString('vi-VN')}] Status: ${h.status} | By: ${h.changed_by} | Note: ${h.note}`);
      });
    }

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await pool.end();
  }
}

main();
