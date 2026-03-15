import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialOverview() {
    const [completedOrders, allOrders, materials, products] = await Promise.all([
      this.prisma.order.findMany({
        where: { status: OrderStatus.COMPLETED },
        select: { totalPrice: true, createdAt: true },
      }),
      this.prisma.order.findMany({
        select: { status: true },
      }),
      this.prisma.material.findMany(),
      this.prisma.product.findMany({
        select: { id: true },
      }),
    ]);

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0,
    );

    const totalMaterialCost = materials.reduce(
      (sum, mat) => sum + Number(mat.unitCost) * mat.stockLevel,
      0,
    );

    const monthlyRevenue = completedOrders.reduce((acc, order) => {
      const month = order.createdAt.toLocaleString('vi-VN', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(order.totalPrice);
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(monthlyRevenue).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    const totalOrders = allOrders.length;
    const completedCount = allOrders.filter(
      (order) => order.status === OrderStatus.COMPLETED,
    ).length;
    const pendingCount = totalOrders - completedCount;

    return {
      totalRevenue,
      totalMaterialCost,
      totalOrders,
      completedOrders: completedCount,
      pendingOrders: pendingCount,
      totalProducts: products.length,
      chartData,
    };
  }
}
