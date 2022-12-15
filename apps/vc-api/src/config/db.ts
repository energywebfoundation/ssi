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
  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.SQLITE_INMEMORY) {
    return {
      ...inMemoryDBConfig,
      ...commonOptions
    };
  }

  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.SQLITE) {
    throw new Error(`${DB_TYPES.SQLITE} database not implemented`);
  }

  if (config.get<DB_TYPES>('DB_TYPE') === DB_TYPES.POSTGRES) {
    throw new Error(`${DB_TYPES.POSTGRES} database not implemented`);
  }
};

export const typeOrmInMemoryModuleFactory = () =>
  TypeOrmModule.forRoot({ ...inMemoryDBConfig, ...commonOptions });
