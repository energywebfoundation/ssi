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

import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { VerifiablePresentationDto } from '../../credentials/dtos/verifiable-presentation.dto';
import { VpRequestDto } from './vp-request.dto';
import { Type } from 'class-transformer';

/**
 * Describes the possible contents of response to a start/continue exchange request
 */
export class ExchangeResponseDto {
  /**
   * Any errors encountered during exchange
   */
  @IsArray()
  @IsString({ each: true })
  errors: string[];

  /**
   * Verifiable Presentation Request.
   * Should conform to VP-Request specification.
   * Will be returned if a VP is required to obtain more information from requester
   * May not be returned if no further information is required (for example, at the end of the workflow)
   */
  @ValidateNested()
  @Type(() => VpRequestDto)
  @IsOptional()
  vpRequest?: VpRequestDto;

  /**
   * If it is an issuance response, then a vp may be provided
   */
  @ValidateNested()
  @Type(() => VerifiablePresentationDto)
  @IsOptional()
  vp?: VerifiablePresentationDto;

  /**
   * True if an exchange submission is currently being processed or reviewed asyncronously
   */
  @IsBoolean()
  processingInProgress: boolean;
}
