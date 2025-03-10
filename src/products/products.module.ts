import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/products/product.entity';
import { UsersModule } from '@/users/users.module';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product]), UsersModule],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('/products/middleware');
  }
}
