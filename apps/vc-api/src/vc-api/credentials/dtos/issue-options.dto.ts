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

import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProofPurpose } from '@sphereon/pex';

/**
 * Options for specifying how the Data Integrity Proof is created for a credential issuance
 * https://w3c-ccg.github.io/vc-api/issuer.html#operation/issueCredential
 */
export class IssueOptionsDto {
  @IsString()
  @IsEnum(ProofPurpose)
  @IsOptional()
  @ApiPropertyOptional({
    description: "The purpose of the proof. Default 'assertionMethod'.",
    enum: ProofPurpose,
    enumName: 'ProofPurpose'
  })
  /**
   * TODO: this is out of spec (https://w3c-ccg.github.io/vc-api/#issue-credential),
   * but required by https://github.com/w3c-ccg/vc-api-test-suite/blob/1280a75771ac933b7d0ebe4710eabed1fcd60eab/packages/vc-http-api-test-server/__tests__/issueCredential.spec.js#L58-L58
   */
  proofPurpose?: ProofPurpose;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The date and time of the proof (with a maximum accuracy in seconds). Default current system time.'
  })
  created?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'A challenge provided by the requesting party of the proof. For example 6e62f66e-67de-11eb-b490-ef3eeefa55f2'
  })
  challenge?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The intended domain of validity for the proof. For example website.example'
  })
  domain?: string;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'The method of credential status to issue the credential including. If omitted credential status will be included.'
  })
  credentialStatus?: Record<string, unknown>;
}
