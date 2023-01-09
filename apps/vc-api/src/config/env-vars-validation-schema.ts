/*
 * Copyright 2021 - 2023 Energy Web Foundation
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

import * as Joi from 'joi';

export enum DB_TYPES {
  SQLITE_INMEMORY = 'SQLITE_INMEMORY',
  SQLITE = 'SQLITE',
  POSTGRES = 'POSTGRES'
}

export const envVarsValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().integer().positive().default(3000),
  BASE_URL: Joi.string().uri().default('http://localhost:3000'),
  DB_TYPE: Joi.string()
    .valid(...Object.values(DB_TYPES))
    .default(DB_TYPES.SQLITE_INMEMORY)
})
  .when('.DB_TYPE', {
    switch: [
      { is: Joi.required().valid(DB_TYPES.SQLITE), then: { SQLITE_FILE: Joi.string().required() } },
      {
        is: Joi.required().valid(DB_TYPES.POSTGRES),
        then: {
          POSTGRES_DB_HOST: Joi.string().hostname().required(),
          POSTGRES_DB_PORT: Joi.number().port().required(),
          POSTGRES_DB_USER: Joi.string().required(),
          POSTGRES_DB_PASSWORD: Joi.string().required(),
          POSTGRES_DB_NAME: Joi.string().required()
        }
      }
    ]
  })
  .when('.DB_TYPE', {
    is: Joi.required().valid(DB_TYPES.SQLITE, DB_TYPES.POSTGRES),
    then: {
      DB_DROP_ON_START: Joi.boolean().default(false),
      DB_SYNCHRONIZE: Joi.boolean().default(false),
      DB_RUN_MIGRATIONS: Joi.boolean().default(true)
    }
  });
