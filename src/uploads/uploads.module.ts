import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  imports: [MulterModule.register()],
})
export class UploadsModule {}
