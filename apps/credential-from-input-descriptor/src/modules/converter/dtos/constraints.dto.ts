import { FieldDto } from './field.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ConstraintsDto {
  @ValidateNested()
  @Type(() => FieldDto)
  @IsNotEmpty()
  fields: FieldDto[];
}
