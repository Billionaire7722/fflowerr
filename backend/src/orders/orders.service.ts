import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { AppGateway } from '../app.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
  ) {}

  async create(data: {
    customerName: string;
    phone: string;
    customMessage?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<Order> {
    const productIds = data.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalPrice = new Prisma.Decimal(0);
    const orderItemsData = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemSubtotal = product.price.mul(item.quantity);
      totalPrice = totalPrice.add(itemSubtotal);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        customMessage: data.customMessage,
        totalPrice,
        status: OrderStatus.PENDING_VERIFICATION,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                materials: true
              }
            }
          }
        },
      },
    });

    // Automatically deduct inventory
    for (const item of order.items) {
      for (const pm of item.product.materials) {
        const neededQuantity = pm.quantity * item.quantity;
        const material = await this.prisma.material.update({
          where: { id: pm.materialId },
          data: {
            stockLevel: {
              decrement: neededQuantity
            }
          }
        });

        // Notify if stock is low (< 5)
        if (material.stockLevel < 5) {
          this.gateway.notifyLowStock(material);
        }
      }
    }

    this.gateway.notifyOrderCreated(order);
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async getAnalytics() {
    // Simple revenue per month analytics
    const orders = await this.prisma.order.findMany({
      where: { status: OrderStatus.COMPLETED },
      select: { totalPrice: true, createdAt: true },
    });

    const revenueByMonth = orders.reduce((acc, order) => {
      const month = order.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + Number(order.totalPrice);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(revenueByMonth).map(([name, revenue]) => ({ name, revenue }));
  }
}
