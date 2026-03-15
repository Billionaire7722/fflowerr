import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  'Bó Hoa Tuoi Mix',
  'Bó Hoa Mini',
  'Hoa Cu?i',
  'Xe Hoa',
  'Tráp Cu?i H?i',
  'K? Khai Truong',
  'L?ng Hoa Tuoi',
  'Bình Hoa Thi?t K?',
  'Lan H? Ði?p',
];

async function main() {
  console.log('Start seeding categories...');
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    console.log(`Created/Updated category: ${category.name}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
