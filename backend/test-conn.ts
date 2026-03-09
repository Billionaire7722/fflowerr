import { Client } from 'pg';
import 'dotenv/config';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    console.log("Testing connection to:", process.env.DATABASE_URL);
    await client.connect();
    console.log("Connected successfully from host!");
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.error("Connection failed from host:", err.message);
    process.exit(1);
  }
}

test();
