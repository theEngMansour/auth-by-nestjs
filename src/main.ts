import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Cors Policy
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  const config = new DocumentBuilder()
    .setTitle('Library For Auth by (@theengmansour)')
    .setDescription('The auth API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
