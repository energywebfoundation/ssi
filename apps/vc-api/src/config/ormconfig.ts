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
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../../.env') });

import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfigFactory } from './db';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';
import { envVarsValidationSchema } from './env-vars-validation-schema';

const entities = [path.resolve(__dirname, '../**/*.entity.ts')];

const validationResults = envVarsValidationSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
  stripUnknown: true
});

if (validationResults.error) {
  console.log('env variables errors:');
  console.log(validationResults.error.details.map((e) => `    ${e.message}`).join('\n'));
  console.log('\nexiting');
  process.exit(1);
}

module.exports = {
  dataSource: new DataSource({
    ...typeOrmConfigFactory({ get: (key: string, def?: string) => process.env[key] || def } as ConfigService),
    entities
  } as DataSourceOptions)
};
