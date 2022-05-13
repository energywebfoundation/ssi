import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { SentryErrorInterceptor } from '../interceptors/sentry-error-interceptor';
import { Logger } from '../logger/logger.service';
import { DecentralizedWebNodeInterceptor } from './decentralized-web-node-response.interceptor';
import { RequestObjectDto } from './dtos/request-object.dto';
import { ResponseObjectDto } from './dtos/response-object.dto';
import { HandlerService } from './services/handler.service';

@UseInterceptors(SentryErrorInterceptor, DecentralizedWebNodeInterceptor)
@Controller({ path: 'webnode', version: '1' })
@ApiTags('Decentralized web node')
export class DecentralizedWebNodeController {
  constructor(private readonly logger: Logger, private readonly collectionHandlerService: HandlerService) {
    this.logger.setContext(DecentralizedWebNodeController.name);
  }

  /*
   * This is an implementation of Decentralized Web Node message handling https://identity.foundation/decentralized-web-node/spec/#messages
   * Currently, ONLY the Collections interface is supported.
   * POST was chosen as the HTTP method to indicate the "messaging" paradigm of this interface
   * For a related discussion, see DIDComm HTTP transport: https://identity.foundation/didcomm-messaging/spec/#https
   */
  @ApiOkResponse({
    type: ResponseObjectDto
  })
  @Post('/')
  public async requestHandler(@Body() requestObject: RequestObjectDto): Promise<ResponseObjectDto> {
    const replies = await Promise.all(
      requestObject.messages.map((message) =>
        this.collectionHandlerService.handleMessage(message, requestObject.target)
      )
    );

    return {
      requestId: requestObject.requestId,
      replies
    };
  }
}
