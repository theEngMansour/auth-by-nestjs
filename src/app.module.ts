import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '@/users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UploadsModule } from '@/uploads/uploads.module';
import { MailModule } from '@/mail/mail.module';
import { ProductsModule } from './products/products.module';
import { Product } from '@/products/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql'>('DB_TYPE', 'mysql'),
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'database-nestjs'),
        entities: [UserEntity, Product],
        synchronize: config.get<boolean>('DB_SYNC', true),
      }),
    }),
    UsersModule,
    UploadsModule,
    MailModule,
    ProductsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
