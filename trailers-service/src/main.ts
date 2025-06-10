import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Bootstrap function
 * 
 * Entry point for the NestJS application.
 * Configures global pipes, CORS, and starts the server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS for frontend integration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // React/Vite dev servers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Set global prefix for API routes
  app.setGlobalPrefix('api');

  // Start the server
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚛 Trailers Microservice running on port ${port}`);
  console.log(`📋 API Documentation: http://localhost:${port}/api`);
  console.log(`🔗 Health Check: http://localhost:${port}/api/trailers`);
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start Trailers Microservice:', error);
  process.exit(1);
});