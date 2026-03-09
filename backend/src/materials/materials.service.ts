import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Material, Prisma } from '@prisma/client';

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Material[]> {
    return this.prisma.material.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: Prisma.MaterialCreateInput): Promise<Material> {
    return this.prisma.material.create({
      data,
    });
  }

  async update(id: string, data: Prisma.MaterialUpdateInput): Promise<Material> {
    return this.prisma.material.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Material> {
    return this.prisma.material.delete({
      where: { id },
    });
  }
}
