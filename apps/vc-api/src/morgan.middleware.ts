import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    morgan('combined')(req, res, next);
  }
}
