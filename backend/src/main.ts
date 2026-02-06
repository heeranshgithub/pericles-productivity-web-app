import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global API prefix if configured.
  // Initially keeping API_V1_PREFIX empty, config setup so later we can add versioning easily
  const apiPrefix = configService.get<string>("API_V1_PREFIX");
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Enable CORS for frontend
  app.enableCors({
    origin: "http://localhost:3000",
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

  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
