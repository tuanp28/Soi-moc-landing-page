const { Client } = require('pg');

const urls = {
  direct_supabase_co: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@db.wanuvqejxogotqrxmdck.supabase.co:5432/postgres",
  direct_aws_1: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-1-ap-south-1.supabase.com:5432/postgres?sslmode=require",
  pooler_aws_1_5432: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true",
  pooler_aws_1_6543: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  pooler_aws_0_5432: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true",
  pooler_aws_0_6543: "postgresql://postgres.wanuvqejxogotqrxmdck:Database12901728@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
};

async function testConnection(name, url) {
  console.log(`\nTesting: ${name}...`);
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`✅ Success for ${name}`);
    const res = await client.query('SELECT NOW()');
    console.log(`   Time: ${res.rows[0].now}`);
    await client.end();
  } catch (err) {
    console.error(`❌ Failed for ${name}:`, err.message);
  }
}

async function run() {
  for (const [name, url] of Object.entries(urls)) {
    await testConnection(name, url);
  }
}

run();
