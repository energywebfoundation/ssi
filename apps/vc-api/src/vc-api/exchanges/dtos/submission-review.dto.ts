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

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { VerifiablePresentationDto } from '../../credentials/dtos/verifiable-presentation.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReviewResult {
  approved = 'approved',
  rejected = 'rejected'
}

export class SubmissionReviewDto {
  @IsEnum(ReviewResult)
  @ApiProperty({
    description: 'The judgement made by the reviewer',
    enum: ReviewResult
    // enumName: 'ReviewResult'
  })
  result: ReviewResult;

  @ValidateNested()
  @IsOptional()
  @Type(() => VerifiablePresentationDto)
  @ApiPropertyOptional({
    description: 'A reviewer may want to include credentials (wrapped in a VP) to the holder'
  })
  vp?: VerifiablePresentationDto;
}
