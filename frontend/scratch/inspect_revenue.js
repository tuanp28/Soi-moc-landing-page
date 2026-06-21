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
    const orders = await prisma.order.findMany();
    const completedPaid = orders.filter(o => o.orderStatus === 'completed' && o.paymentStatus === 'paid');
    const totalRev = completedPaid.reduce((sum, o) => sum + o.totalAmount, 0);

    console.log(`Total orders in DB: ${orders.length}`);
    console.log(`Completed & Paid orders count: ${completedPaid.length}`);
    console.log(`Current Total Revenue: ${totalRev} VND`);
    console.log('\nDetails of Completed & Paid orders:');
    completedPaid.forEach(o => {
      console.log(`- ID: ${o.id} | Amount: ${o.totalAmount} | Name: ${o.customerName}`);
    });
  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
