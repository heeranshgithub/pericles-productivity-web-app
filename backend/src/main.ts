import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SecretsService } from './secrets/secrets.service';

async function bootstrap() {
  // Load secrets from AWS Secrets Manager in production before app initialization
  if (process.env.NODE_ENV === 'production') {
    const secretsService = new SecretsService();
    await secretsService.loadSecrets();
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global API prefix if configured.
  // Initially keeping API_V1_PREFIX empty, config setup so later we can add versioning easily
  const apiPrefix = configService.get<string>('API_V1_PREFIX');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Enable CORS for frontend
  const frontendUrlRaw =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const frontendOrigins = frontendUrlRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: frontendOrigins.length <= 1 ? frontendOrigins[0] : frontendOrigins,
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;
  // Explicitly bind to 0.0.0.0 for cloud deployment compatibility (Render, Docker, etc.)
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
