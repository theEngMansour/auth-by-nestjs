import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '@/users/providers/auth.provider';
import { MulterModule } from '@nestjs/platform-express';
import { MailModule } from '@/mail/mail.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthProvider],
  imports: [
    MulterModule.register(),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    MailModule,
  ],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
