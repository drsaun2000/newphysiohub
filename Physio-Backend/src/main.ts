import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './utils/global.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1');
  
  // More flexible CORS configuration for development
  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // List of allowed origins
      const allowedOrigins = [
        'https://physiohub.io',
        'https://admin.physiohub.io',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5000',
        'https://661b-46-217-83-97.ngrok-free.app',
        'https://661b-46-217-83-97.ngrok-free.app'
      ];
      
      // Allow any ngrok URL (for development)
      const isNgrokUrl = origin.includes('.ngrok-free.app') || origin.includes('.ngrok.io');
      
      if (allowedOrigins.includes(origin) || isNgrokUrl) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Course API')
    .setDescription('API for managing courses')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}

bootstrap();
