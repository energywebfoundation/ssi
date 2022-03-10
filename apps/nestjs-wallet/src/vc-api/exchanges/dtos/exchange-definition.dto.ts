import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { VpRequestQueryDto } from './vp-request-query.dto';
import { ExchangeInteractServiceDefinitionDto } from './exchange-interact-service-definition.dto';
import { CallbackConfigurationDto } from './callback-configuration.dto';

/**
 * A exchange definition
 */
export class ExchangeDefinitionDto {
  @IsString()
  exchangeId: string;

  @ValidateNested()
  interactServices: ExchangeInteractServiceDefinitionDto[];

  @ValidateNested({ each: true })
  query: VpRequestQueryDto[];

  @IsBoolean()
  isOneTime: boolean;

  @ValidateNested({ each: true })
  callback: CallbackConfigurationDto[];
}
