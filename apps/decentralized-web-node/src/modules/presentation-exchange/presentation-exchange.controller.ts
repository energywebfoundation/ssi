import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SentryErrorInterceptor } from '../interceptors/sentry-error-interceptor';
import { Logger } from '../logger/logger.service';
import { MatchResultsDto } from './dtos/match-results.dto';
import { PresentationDefinitionDto } from './dtos/presentation-definition.dto';
import { VCMatchService } from './services/vc-match.service';

@UseInterceptors(SentryErrorInterceptor)
@Controller({ path: 'vp', version: '1' })
@ApiTags('Verifiable Presentation')
export class PresentationExchangeController {
  constructor(private readonly logger: Logger, private readonly vcMatchService: VCMatchService) {
    this.logger.setContext(PresentationExchangeController.name);
  }

  @Post('/match/:subject')
  @ApiOkResponse({ type: MatchResultsDto })
  public async getMatchedCredentialsForVpDefinition(
    @Body() presentationDefinition: PresentationDefinitionDto,
    @Param('subject') subject: string
  ): Promise<MatchResultsDto> {
    return await this.vcMatchService.matchCredentials(presentationDefinition, subject);
  }
}
