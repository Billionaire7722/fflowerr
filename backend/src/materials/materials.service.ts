import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Material, Prisma } from '@prisma/client';
import { AppGateway } from '../app.gateway';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MaterialsService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(): Promise<Material[]> {
    return this.prisma.material.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: any, file?: Express.Multer.File): Promise<Material> {
    let imageUrl: string | undefined;
    if (file) {
      const res = await this.cloudinary.uploadFile(file);
      imageUrl = res.secure_url;
    }

    const material = await this.prisma.material.create({
      data: {
        ...data,
        stockLevel: Number(data.stockLevel),
        unitCost: new Prisma.Decimal(data.unitCost),
        image: imageUrl,
      },
    });
    this.gateway.notifyProductUpdated({ material, type: 'material' });
    return material;
  }

  async update(id: string, data: any, file?: Express.Multer.File): Promise<Material> {
    let imageUrl: string | undefined;
    if (file) {
      const res = await this.cloudinary.uploadFile(file);
      imageUrl = res.secure_url;
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.unit) updateData.unit = data.unit;
    if (data.stockLevel !== undefined) updateData.stockLevel = Number(data.stockLevel);
    if (data.unitCost !== undefined) updateData.unitCost = new Prisma.Decimal(data.unitCost);
    if (imageUrl) updateData.image = imageUrl;

    const material = await this.prisma.material.update({
      where: { id },
      data: updateData,
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
