import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { AppGateway } from '../app.gateway';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        materials: {
          include: { material: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(product => {
      const productionCost = product.materials.reduce((sum, pm) => {
        return sum + (Number(pm.material.unitCost) * pm.quantity);
      }, 0);
      return { ...product, productionCost };
    });
  }

  async findOne(id: string): Promise<any | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        materials: {
          include: { material: true }
        }
      },
    });
    if (!product) return null;
    
    const productionCost = product.materials.reduce((sum, pm) => {
      return sum + (Number(pm.material.unitCost) * pm.quantity);
    }, 0);
    return { ...product, productionCost };
  }

  async create(
    data: any, 
    files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
  ): Promise<Product> {
    const imageUrls: string[] = [];
    const videoUrls: string[] = [];

    if (files?.images) {
      for (const file of files.images) {
        const res = await this.cloudinary.uploadFile(file);
        imageUrls.push(res.secure_url);
      }
    }

    if (files?.videos) {
      for (const file of files.videos) {
        const res = await this.cloudinary.uploadFile(file);
        videoUrls.push(res.secure_url);
      }
    }

    const { materials, categoryId, ...rest } = data;
    const product = await this.prisma.product.create({
      data: {
        ...rest,
        images: imageUrls,
        videos: videoUrls,
        price: new Prisma.Decimal(rest.price),
        categoryId: categoryId || undefined,
        materials: {
          create: materials ? JSON.parse(materials).map((m: any) => ({
            materialId: m.materialId,
            quantity: m.quantity
          })) : []
        }
      },
    });
    this.gateway.notifyProductUpdated(product);
    return product;
  }

  async update(
    id: string, 
    data: any,
    files?: { images?: Express.Multer.File[], videos?: Express.Multer.File[] }
  ): Promise<Product> {
    const imageUrls: string[] = data.existingImages || [];
    const videoUrls: string[] = data.existingVideos || [];

    if (files?.images) {
      for (const file of files.images) {
        const res = await this.cloudinary.uploadFile(file);
        imageUrls.push(res.secure_url);
      }
    }

    if (files?.videos) {
      for (const file of files.videos) {
        const res = await this.cloudinary.uploadFile(file);
        videoUrls.push(res.secure_url);
      }
    }

    const { materials, categoryId, existingImages, existingVideos, ...rest } = data;

    if (materials) {
      await this.prisma.productMaterial.deleteMany({
        where: { productId: id }
      });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        images: imageUrls,
        videos: videoUrls,
        price: rest.price ? new Prisma.Decimal(rest.price) : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        materials: materials ? {
          create: JSON.parse(materials).map((m: any) => ({
            materialId: m.materialId,
            quantity: m.quantity
          }))
        } : undefined
      },
    });
    this.gateway.notifyProductUpdated(product);
    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    this.gateway.notifyProductUpdated({ id, deleted: true });
    return product;
  }
}
