import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Material, Prisma } from '@prisma/client';
import { AppGateway } from '../app.gateway';

@Injectable()
export class MaterialsService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
  ) {}

  async findAll(): Promise<Material[]> {
    return this.prisma.material.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: Prisma.MaterialCreateInput): Promise<Material> {
    const material = await this.prisma.material.create({
      data,
    });
    this.gateway.notifyProductUpdated({ material, type: 'material' });
    return material;
  }

  async update(id: string, data: Prisma.MaterialUpdateInput): Promise<Material> {
    const material = await this.prisma.material.update({
      where: { id },
      data,
    });
    this.gateway.notifyProductUpdated({ material, type: 'material' });
    return material;
  }

  async remove(id: string): Promise<Material> {
    const material = await this.prisma.material.delete({
      where: { id },
    });
    this.gateway.notifyProductUpdated({ id, deleted: true, type: 'material' });
    return material;
  }
}
