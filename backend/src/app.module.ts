import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MaterialsModule } from './materials/materials.module';

@Module({
  imports: [PrismaModule, ProductsModule, OrdersModule, MaterialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
