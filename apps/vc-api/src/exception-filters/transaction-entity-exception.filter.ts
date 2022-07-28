/*
 * Copyright 2021, 2022 Energy Web Foundation
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

import { BaseExceptionFilter } from '@nestjs/core';
import { TransactionEntityException } from '../vc-api/exchanges/entities/transaction.entity';
import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';

@Catch(TransactionEntityException)
export class TransactionEntityExceptionFilter extends BaseExceptionFilter {
  catch(exception: TransactionEntityException, host: ArgumentsHost): void {
    switch (exception.name) {
      case 'TransactionDidForbiddenException':
        super.catch(new ForbiddenException(exception.message), host);
        break;

      default:
        super.catch(exception, host);
        break;
    }
  }
}
