/**
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

import { IsEnum } from 'class-validator';
import { VpRequestInteractServiceType } from '../types/vp-request-interact-service-type';
import { ApiProperty } from '@nestjs/swagger';

/**
 * A definition of an interact service to be used in a workflow
 */
export class ExchangeInteractServiceDefinitionDto {
  @IsEnum(VpRequestInteractServiceType)
  @ApiProperty({
    description:
      'The "type" of the interact service.\n' +
      'See Verifiable Presentation Request [Interaction Types](https://w3c-ccg.github.io/vp-request-spec/#interaction-types) for background.',
    enum: VpRequestInteractServiceType,
    enumName: 'VpRequestInteractServiceType'
  })
  type: VpRequestInteractServiceType;
}
