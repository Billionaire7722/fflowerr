import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  private readonly defaultCategories = [
    'Bó Hoa Tươi Mix',
    'Bó Hoa Mini',
    'Hoa Cưới',
    'Xe Hoa',
    'Tráp Cưới Hỏi',
    'Kệ Khai Trương',
    'Lẵng Hoa Tươi',
    'Bình Hoa Thiết Kế',
    'Lan Hồ Điệp',
  ];

  async onModuleInit() {
    await this.ensureDefaultCategories();
  }

  private async ensureDefaultCategories() {
    const existing = await this.prisma.category.findMany({
      select: { name: true },
    });
    const existingNames = new Set(existing.map((cat) => cat.name));
    const missing = this.defaultCategories.filter(
      (name) => !existingNames.has(name),
    );

    if (!missing.length) return;

    await this.prisma.category.createMany({
      data: missing.map((name) => ({ name })),
      skipDuplicates: true,
    });

    this.logger.log(`Seeded ${missing.length} default categories.`);
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
