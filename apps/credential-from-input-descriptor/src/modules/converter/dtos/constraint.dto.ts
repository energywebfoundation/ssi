import { FieldDto } from './field.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ConstraintDto {
  @ValidateNested()
  @Type(() => FieldDto)
  @IsNotEmpty()
  fields: FieldDto[];
}
