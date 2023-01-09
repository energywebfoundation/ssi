/*
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

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DB_TYPES } from './env-vars-validation-schema';
import * as path from 'path';

/**
 * Inspired by https://dev.to/webeleon/unit-testing-nestjs-with-typeorm-in-memory-l6m
 */
const inMemoryDBConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  keepConnectionAlive: true // https://github.com/nestjs/typeorm/issues/61
};

const commonOptions = {
  autoLoadEntities: true // https://docs.nestjs.com/techniques/database#auto-load-entities
};

export const typeOrmConfigFactory = (config: ConfigService): TypeOrmModuleOptions => {
  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.SQLITE_IN_MEMORY) {
    return {
      ...inMemoryDBConfig,
      ...commonOptions
    };
  }

  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.SQLITE) {
    const SQLITE_FILE = config.get('SQLITE_FILE');
    if (!SQLITE_FILE) {
      throw new Error(`SQLITE_FILE not set`);
    }

    // this is required because migration generation is executed from the migrations subfolder
    const databaseFilePath = path.isAbsolute(SQLITE_FILE)
      ? SQLITE_FILE
      : path.resolve(__dirname, '../..', SQLITE_FILE);

    return {
      type: 'better-sqlite3',
      database: databaseFilePath,
      dropSchema: config.get('DB_DROP_ON_START'),
      synchronize: config.get('DB_SYNC_SCHEMA_ON_START'),
      migrationsRun: config.get('DB_RUN_MIGRATIONS'),
      migrations: [`${path.resolve(__dirname, '../migrations/sqlite')}/*.{ts,js}`],
      ...commonOptions
    };
  }

  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.POSTGRES) {
    return {
      type: 'postgres',
      host: config.get('POSTGRES_DB_HOST'),
      port: +config.get('POSTGRES_DB_PORT'),
      username: config.get('POSTGRES_DB_USER'),
      password: config.get('POSTGRES_DB_PASSWORD'),
      database: config.get('POSTGRES_DB_NAME'),
      dropSchema: config.get('DB_DROP_ON_START'),
      synchronize: config.get('DB_SYNC_SCHEMA_ON_START'),
      migrationsRun: config.get('DB_RUN_MIGRATIONS'),
      migrations: [`${path.resolve(__dirname, '../migrations/pg')}/*.{ts,js}`],
      ...commonOptions
    };
  }
};

export const typeOrmInMemoryModuleFactory = () =>
  TypeOrmModule.forRoot({ ...inMemoryDBConfig, ...commonOptions });
