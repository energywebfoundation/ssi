import { Module } from '@nestjs/common';
import { ConverterService } from './converter.service';
import { ConverterController } from './converter.controller';

@Module({
  providers: [ConverterService],
  controllers: [ConverterController]
})
export class ConverterModule {}
