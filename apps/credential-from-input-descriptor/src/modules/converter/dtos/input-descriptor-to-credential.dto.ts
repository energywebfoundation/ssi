import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConstraintDto } from './constraint.dto';

export class InputDesciptorToCredentialDto {
  @ValidateNested()
  @Type(() => ConstraintDto)
  @IsNotEmpty()
  constraints: ConstraintDto;
}
