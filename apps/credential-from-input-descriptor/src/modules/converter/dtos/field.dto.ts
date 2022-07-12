import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTopLevelFieldJsonPath } from './validators/is-top-level-field-json-path';
import { IsAllowedFieldJsonPathKey } from './validators/is-allowed-field-json-path-key';

const filterExample = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: [
    {
      const: 'https://www.w3.org/2018/credentials/v1'
    },
    {
      $ref: '#/definitions/eliaGroupContext'
    }
  ],
  additionalItems: false,
  minItems: 2,
  maxItems: 2,
  definitions: {
    eliaGroupContext: {
      type: 'object',
      properties: {
        elia: {
          const: 'https://https://www.eliagroup.eu/ld-context-2022#'
        },
        consent: {
          const: 'elia:consent'
        }
      },
      additionalProperties: false,
      required: ['elia', 'consent']
    }
  }
};

export class FieldDto {
  @IsAllowedFieldJsonPathKey()
  @IsTopLevelFieldJsonPath()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '$.@context' })
  path: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ example: JSON.stringify(filterExample) })
  filter: unknown;
}
