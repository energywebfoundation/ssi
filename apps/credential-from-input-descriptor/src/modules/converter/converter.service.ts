import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConverterService {
  private readonly logger = new Logger(ConverterService.name, { timestamp: true });
}
