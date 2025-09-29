import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// CORS options mirroring main.ts
const createCorsOptions = (frontendUrl: string) => ({
  origin: [frontendUrl, process.env.FRONTEND_URL || 'http://localhost:3000', 'https://paras-ruby.vercel.app', 'https://paras-hb2o.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

let cachedServer: express.Express | null = null;

async function bootstrapServer(): Promise<express.Express> {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  // Global setup matching local server
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(createCorsOptions(frontendUrl));

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      cachedServer = await bootstrapServer();
      // Simple log to verify cold start
      console.log('✅ Nest app initialized for serverless function');
    }
    return (cachedServer as any)(req, res);
  } catch (error: any) {
    console.error('❌ Serverless handler error:', error?.stack || error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'FUNCTION_INVOCATION_FAILED',
      message: error?.message || 'Unknown error',
    }));
  }
}