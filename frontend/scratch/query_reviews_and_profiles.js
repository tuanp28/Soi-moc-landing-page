const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  console.log("Connected to database!");

  // Query reviews
  const reviewsRes = await client.query('SELECT * FROM "Review"');
  console.log(`Found ${reviewsRes.rows.length} reviews:`);
  reviewsRes.rows.forEach(r => {
    console.log(`- Review ID: ${r.id} | Name: ${r.name} | userId: ${r.userId} | text: ${r.text.substring(0, 50)}...`);
  });

  // Query profiles
  const profilesRes = await client.query('SELECT * FROM "Profile"');
  console.log(`\nFound ${profilesRes.rows.length} profiles:`);
  profilesRes.rows.forEach(p => {
    console.log(`- Profile ID: ${p.id} | Email: ${p.email} | Name: ${p.fullName} | Role: ${p.role}`);
  });

  await client.end();
}

run().catch(console.error);
