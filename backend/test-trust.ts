import { Client } from 'pg';

// Test with NO password
const client = new Client({
  user: 'flower_shop_user',
  host: '127.0.0.1',
  database: 'flower_shop_db',
  port: 5432,
});

async function test() {
  try {
    await client.connect();
    console.log("Connected successfully with NO password!");
    await client.end();
  } catch (err: any) {
    console.error("Connection with NO password failed:", err.message);
  }
}

test();
