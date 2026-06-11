import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Insurance API')
    .setDescription(
      'NestJS service implementing a hexagonal architecture and design patterns ' +
        '(Factory Method, Strategy, Builder, State, Observer, Singleton).',
    )
    .setVersion('0.1.0')
    .addTag('policies')
    .addTag('customers')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}/api`);
  console.log(`Swagger UI available at: http://localhost:${port}/api/docs`);
}
void bootstrap();
