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

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
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

    const product = await this.prisma.product.create({
      data: {
        ...data,
        images: imageUrls,
        videos: videoUrls,
        price: new Prisma.Decimal(data.price),
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

    // Clean up data for Prisma
    delete data.existingImages;
    delete data.existingVideos;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: imageUrls,
        videos: videoUrls,
        price: data.price ? new Prisma.Decimal(data.price) : undefined,
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
