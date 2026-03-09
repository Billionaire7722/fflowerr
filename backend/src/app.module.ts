import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MaterialsModule } from './materials/materials.module';
import { AppGateway } from './app.gateway';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [PrismaModule, ProductsModule, OrdersModule, MaterialsModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
