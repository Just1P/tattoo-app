import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const allowedOrigins =
    configService.get<string[]>('cors.allowedOrigins') || [];
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600,
  });

  app.enableShutdownHooks();

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);

  const backendUrl =
    configService.get<string>('urls.backend') || `http://localhost:${port}`;
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';

  console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Application démarrée avec succès      ║
║                                           ║
║  📍 URL: ${backendUrl.padEnd(29)} ║
║  🌍 Environnement: ${nodeEnv.padEnd(19)} ║
║  🔒 Sécurité: Activée                     ║
╚═══════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('❌ Erreur au démarrage:', error);
  process.exit(1);
});
