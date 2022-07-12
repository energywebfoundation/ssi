import { Body, Controller, Post } from '@nestjs/common';
import { ConverterService } from './converter.service';
import { InputDesciptorToCredentialDto, InputDescriptorToCredentialResponseDto } from './dtos';

@Controller('converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post('input-descriptor-to-credential')
  async inputDescriptorToCredential(
    @Body() inputDesciptorToCredentialDto: InputDesciptorToCredentialDto
  ): Promise<InputDescriptorToCredentialResponseDto> {
    return this.converterService.convertInputDescriptorToCredential(inputDesciptorToCredentialDto);
  }
}
