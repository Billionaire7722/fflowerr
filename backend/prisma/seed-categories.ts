import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  "Bó hoa tươi phối",
  "Bó hoa mini",
  "Hoa cưới cầm tay",
  "Hoa xe cưới",
  "Tráp dạm ngõ, ăn hỏi",
  "Kệ hoa khai trương",
  "Giỏ hoa tươi",
  "Bình hoa thiết kế",
  "Lan Hồ Điệp"
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
