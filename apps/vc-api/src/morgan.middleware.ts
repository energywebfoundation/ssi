import { Injectable, NestMiddleware } from '@nestjs/common';
import * as morgan from 'morgan';
import { morganFormat } from './logging.config';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.baseUrl !== '' && req.baseUrl !== '/') {
      morgan(morganFormat)(req, res, next);
    } else {
      next();
    }
  }
}
