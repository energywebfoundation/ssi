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

import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VerifiableCredentialDto } from './verifiable-credential.dto';
import { IsStringOrStringArray } from './custom-class-validator/is-string-or-string-array';
import { Presentation } from '../../exchanges/types/presentation';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * A JSON-LD Verifiable Presentation without a proof.
 * https://w3c-ccg.github.io/vc-api/holder.html#operation/provePresentation
 */
export class PresentationDto implements Presentation {
  @IsArray()
  @ApiProperty({
    description: 'The JSON-LD context of the presentation.',
    type: 'array',
    items: { oneOf: [{ type: 'string' }, { type: 'object' }] }
  })
  '@context': Array<string | Record<string, unknown>>;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The ID of the presentation. ' +
      'The id property is optional and MAY be used to provide a unique identifier for the presentation. ' +
      'https://www.w3.org/TR/vc-data-model/#presentations-0'
  })
  id?: string;

  @IsStringOrStringArray()
  @ApiProperty({ description: 'The JSON-LD type of the presentation.' })
  type: string[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The holder - will be ignored if no proof is present since there is no proof of authority over the credentials'
  })
  holder?: string;

  @ValidateNested({ each: true })
  @Type(() => VerifiableCredentialDto)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The Verifiable Credentials',
    type: VerifiableCredentialDto,
    isArray: true
  })
  verifiableCredential?: VerifiableCredentialDto[];
}
