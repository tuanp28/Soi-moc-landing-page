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
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    console.log("Recent 50 audit logs:");
    logs.forEach(l => {
      console.log(`[${l.createdAt.toISOString()}] ${l.userEmail} | Action: ${l.action} | Details: ${l.details}`);
    });
  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
