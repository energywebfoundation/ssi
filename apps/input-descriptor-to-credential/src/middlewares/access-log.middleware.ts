/*
 * Copyright 2021 - 2023 Energy Web Foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AccessLog implements NestMiddleware {
  private readonly logger = new Logger(AccessLog.name, { timestamp: true });

  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const { method } = req;
    const url = req.originalUrl;

    let finished = false;

    let responseBody: string;

    try {
      const oldWrite = res.write;
      const oldEnd = res.end;
      const chunks: Buffer[] = [];

      res.write = (...args: unknown[]): boolean => {
        try {
          chunks.push(args[0] as Buffer);
        } catch (err) {
          this.logger.error(`error collecting response body chunk: ${err}`);
          this.logger.verbose(err.stack);
        }

        return oldWrite.apply(res, args);
      };

      res.end = (...args: unknown[]) => {
        try {
          const chunk = args[0] as Buffer;

          if (chunk) {
            chunks.push(chunk);
          }

          responseBody = Buffer.concat(chunks).toString();
        } catch (err) {
          this.logger.error(`error collecting response body chunk: ${err}`);
          this.logger.verbose(err.stack);
        }

        return oldEnd.apply(res, args);
      };
    } catch (err) {
      this.logger.error(`error setting response body to be collected: ${err}`);
      this.logger.verbose(err.stack);
    }

    res.on('finish', () => {
      const delay = Date.now() - now;
      const message = `${res.statusCode} ${res.statusMessage} | ${req.ip} | [${method}] ${url} - ${delay}ms`;

      finished = true;

      if (is4xxErrorCode(res.statusCode)) {
        this.logger.warn(message);
      } else if (is5xxErrorCode(res.statusCode)) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }

      if (req.body) {
        this.logger.debug(`request body: ${JSON.stringify(req.body)}`);
      }

      if (responseBody) {
        this.logger.debug(`response body: ${responseBody}`);
      }
    });

    res.on('close', () => {
      if (!finished) {
        const delay = Date.now() - now;
        this.logger.warn(`interrupted | [${method}] ${url} - ${delay}ms`);
      }
    });

    next();
  }
}

function is4xxErrorCode(statusCode: number) {
  return statusCode.toString().match(/4[0-9]{2}/);
}

function is5xxErrorCode(statusCode: number) {
  return statusCode.toString().match(/5[0-9]{2}/);
}
