import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConstraintsDto } from './constraints.dto';

export class InputDesciptorToCredentialDto {
  @ValidateNested()
  @Type(() => ConstraintsDto)
  @IsNotEmpty()
  constraints: ConstraintsDto;
}
