import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialOverview() {
    // 1. Total Revenue (Completed Orders sum)
    const orders = await this.prisma.order.findMany({
      where: { status: OrderStatus.COMPLETED },
      select: { totalPrice: true, createdAt: true },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

    // 2. Material Costs
    const materials = await this.prisma.material.findMany();
    const totalMaterialCost = materials.reduce((sum, mat) => sum + (Number(mat.unitCost) * mat.stockLevel), 0);

    // 3. Monthly Data for Charts
    const monthlyRevenue = orders.reduce((acc, order) => {
      const month = order.createdAt.toLocaleString('vi-VN', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(order.totalPrice);
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(monthlyRevenue).map(([name, revenue]) => ({
      name,
      revenue,
      profit: revenue * 0.4, // Simplified profit estimation for now
    }));

    return {
      totalRevenue,
      totalMaterialCost,
      netProfit: totalRevenue - totalMaterialCost,
      chartData,
      bestMonth: Object.keys(monthlyRevenue).reduce((a, b) => monthlyRevenue[a] > monthlyRevenue[b] ? a : b, 'N/A')
    };
  }
}
