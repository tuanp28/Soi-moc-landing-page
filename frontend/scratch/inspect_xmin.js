const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

async function main() {
  try {
    const res = await pool.query(`
      SELECT xmin::text as txid, COUNT(*), MIN(created_at) as min_created, MAX(created_at) as max_created
      FROM orders
      GROUP BY xmin::text
      ORDER BY txid DESC
    `);
    console.log("Orders grouped by xmin transaction ID:");
    console.log(res.rows);

    const resHistory = await pool.query(`
      SELECT xmin::text as txid, COUNT(*), MIN(changed_at) as min_changed, MAX(changed_at) as max_changed
      FROM order_status_history
      GROUP BY xmin::text
      ORDER BY txid DESC
    `);
    console.log("\nOrder Status History grouped by xmin transaction ID:");
    console.log(resHistory.rows);

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await pool.end();
  }
}

main();
