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

const targetIds = [
  "SM-104928", "SM-115829", "SM-172611", "SM-182903", "SM-192834",
  "SM-291038", "SM-291039", "SM-291040", "SM-293810", "SM-294018",
  "SM-319208", "SM-382910", "SM-392019", "SM-392815", "SM-482910",
  "SM-490381", "SM-490382", "SM-490384", "SM-548190", "SM-560288",
  "SM-581902", "SM-582903", "SM-602931", "SM-603928", "SM-638201",
  "SM-672901", "SM-690234", "SM-719302", "SM-740291", "SM-741295",
  "SM-748902", "SM-749281", "SM-829103", "SM-831742", "SM-839102",
  "SM-839105", "SM-839106", "SM-849203", "SM-849302", "SM-902381",
  "SM-902813", "SM-994821"
];

async function main() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        id: {
          in: targetIds
        }
      }
    });

    console.log(`Found ${orders.length} out of ${targetIds.length} target orders in DB:`);
    orders.forEach(o => {
      console.log(`ID: ${o.id} | CreatedAt: ${o.createdAt.toISOString()} | Customer: ${o.customerName}`);
    });
  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
