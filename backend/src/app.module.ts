import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MaterialsModule } from './materials/materials.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WebsocketModule } from './websocket/websocket.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    PrismaModule, 
    WebsocketModule,
    ProductsModule, 
    OrdersModule, 
    MaterialsModule, 
    AnalyticsModule, CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
