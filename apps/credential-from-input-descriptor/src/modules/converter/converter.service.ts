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

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InputDesciptorToCredentialDto } from './dtos';
import jsf, { Schema } from 'json-schema-faker';
import { JsonValue } from 'type-fest';

@Injectable()
export class ConverterService {
  private readonly logger = new Logger(ConverterService.name, { timestamp: true });

  public async convertInputDescriptorToCredential(
    inputDesciptorToCredentialDto: InputDesciptorToCredentialDto
  ): Promise<unknown> {
    const intermediateResults: { path: string; result: JsonValue }[] = await Promise.all(
      inputDesciptorToCredentialDto.constraints.fields.map(async (field) =>
        ConverterService.convertField(field)
      )
    );

    return intermediateResults.reduce((acc, resultItem) => {
      const path: string = resultItem.path;

      this.logger.debug(`processing "${path}"`);

      if (!ConverterService.pathIsValid(path)) {
        this.logger.warn(`invalid path: ${path}`);
        throw new BadRequestException(`invalid path: ${path}`);
      }

      const key = path.split('.')[1];

      acc[key] = resultItem.result;

      return acc;
    }, {});
  }

  private static async convertField(field: { path: string; filter: Schema }): Promise<{
    path: string;
    result: JsonValue;
  }> {
    return {
      path: field.path,
      result: await jsf.resolve(field.filter)
    };
  }

  private static pathIsValid(path: string): boolean {
    const elements = path.split('.');
    if (elements.length !== 2) {
      return false;
    }

    if (elements[0] !== '$') {
      return false;
    }

    return true;
  }
}
