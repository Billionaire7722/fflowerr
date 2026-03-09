import { Client } from 'pg';

const client = new Client({
  connectionString: "postgresql://flower_shop_user:flower_shop_password@localhost:5432/flower_shop_db?schema=public",
});

async function test() {
  try {
    await client.connect();
    console.log("Connected successfully");
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    await client.end();
  } catch (err: any) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

test();
