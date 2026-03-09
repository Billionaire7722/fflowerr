import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { AppGateway } from '../app.gateway';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
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

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    const product = await this.prisma.product.create({
      data,
    });
    this.gateway.notifyProductUpdated(product);
    return product;
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data,
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
