/**
 * Copyright 2021, 2022 Energy Web Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransactionEntityExceptionFilter } from './exception-filters/transaction-entity-exception.filter';

export const API_DEFAULT_VERSION: string = '1';
export const API_DEFAULT_VERSION_PREFIX: string = `/v${API_DEFAULT_VERSION}`;

async function setupApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new TransactionEntityExceptionFilter(app.getHttpAdapter()));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [API_DEFAULT_VERSION]
  });
  return app;
}

function setupSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('VC-API')
    .setDescription('Sample VC-API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return document;
}

export { setupApp, setupSwaggerDocument };
