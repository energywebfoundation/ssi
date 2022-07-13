import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap', { timestamp: true });
  logger.debug('starting');

  const app = await NestFactory.create(AppModule);
  setupApp(app);
  setupSwaggerDocument(app);

  const port = parseInt(process.env.PORT) || 3000;
  await app.listen(port);
  logger.log(`listening on http://127.0.0.1:${port}`);
  logger.log(`Swagger available on http://127.0.0.1:${port}/api`);
}

bootstrap();

function setupApp(app: INestApplication) {
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableShutdownHooks(); // this is required for a docker container to shut down properly
}

function setupSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Input Descriptor to Credential converter')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return document;
}
