const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    console.log("Recent 50 orders:");
    orders.forEach(o => {
      console.log(`ID: ${o.id} | CreatedAt: ${o.createdAt.toISOString()} | Customer: ${o.customerName} | Status: ${o.orderStatus} | Payment: ${o.paymentStatus}`);
    });
  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
