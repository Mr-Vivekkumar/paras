import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Pure functional configuration utilities
const createCorsOptions = (frontendUrl: string) => ({
  origin: [frontendUrl, 'http://localhost:3000', 'https://paras-ruby.vercel.app', 'https://paras-hb2o.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

const createValidationPipe = () => new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});

const setupGlobalPipes = (app: any) => {
  app.useGlobalPipes(createValidationPipe());
};

const setupGlobalFilters = (app: any) => {
  app.useGlobalFilters(new AllExceptionsFilter());
};

const setupGlobalInterceptors = (app: any) => {
  app.useGlobalInterceptors(new LoggingInterceptor());
};

const setupCors = (app: any, frontendUrl: string) => {
  app.enableCors(createCorsOptions(frontendUrl));
};

const setupSwagger = (app: any, port: number) => {
  const config = new DocumentBuilder()
    .setTitle('Menu Management API')
    .setDescription('API documentation for the Menu Management System')
    .setVersion('1.0')
    .addTag('menus', 'Menu management endpoints')
    .addTag('menu-items', 'Menu item management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
};

const startServer = async (app: any, port: number) => {
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT', 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  
  // Setup global configurations
  setupGlobalPipes(app);
  setupGlobalFilters(app);
  setupGlobalInterceptors(app);
  setupCors(app, frontendUrl);
  setupSwagger(app, port);
  
  // Start server
  await startServer(app, port);
}

bootstrap();
