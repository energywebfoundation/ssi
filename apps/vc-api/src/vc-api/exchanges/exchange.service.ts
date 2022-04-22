/**
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

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ProofPurpose } from '@sphereon/pex';
import { Repository } from 'typeorm';
import { CredentialsService } from '../credentials/credentials.service';
import { VerifiablePresentationDto } from '../credentials/dtos/verifiable-presentation.dto';
import { ExchangeEntity } from './entities/exchange.entity';
import { ExchangeResponseDto } from './dtos/exchange-response.dto';
import { VpRequestDto } from './dtos/vp-request.dto';
import { ExchangeDefinitionDto } from './dtos/exchange-definition.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import { VerifyOptionsDto } from '../credentials/dtos/verify-options.dto';
import { TransactionDto } from './dtos/transaction.dto';
import { VpRequestSubmissionVerifier } from './vp-request-submission-verifier';

@Injectable()
export class ExchangeService {
  constructor(
    private vcApiService: CredentialsService,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(ExchangeEntity)
    private exchangeRepository: Repository<ExchangeEntity>,
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  public async createExchange(exchangeDefinitionDto: ExchangeDefinitionDto) {
    const exchange = new ExchangeEntity(exchangeDefinitionDto);
    await this.exchangeRepository.save(exchange);
    return {
      errors: []
    };
  }

  /**
   * Starts a credential exchange
   * @param exchangeId
   * @returns exchange response
   */
  public async startExchange(exchangeId: string): Promise<ExchangeResponseDto> {
    const exchange = await this.exchangeRepository.findOne(exchangeId);
    if (!exchange) {
      return {
        errors: [`${exchangeId}: no exchange definition found for this exchangeId`]
      };
    }
    const baseUrl = this.configService.get<string>('baseUrl');
    if (!baseUrl) {
      return {
        errors: [`base url is not defined`]
      };
    }
    const baseWithControllerPath = `${baseUrl}/vc-api`;
    const transaction = exchange.start(baseWithControllerPath);
    await this.transactionRepository.save(transaction);
    return {
      errors: [],
      vpRequest: VpRequestDto.toDto(transaction.vpRequest)
    };
  }

  /**
   * Handle a presentation submitted to an exchange
   * TODO: add logging of errors (using structured logs?)
   * @param verifiablePresentation
   * @param transactionId
   * @returns exchange response
   */
  public async continueExchange(
    verifiablePresentation: VerifiablePresentationDto,
    transactionId: string
  ): Promise<ExchangeResponseDto> {
    const transactionQuery = await this.getExchangeTransaction(transactionId);
    if (transactionQuery.errors.length > 0 || !transactionQuery.transaction) {
      return {
        errors: transactionQuery.errors
      };
    }
    const transaction = transactionQuery.transaction;
    const vpRequest = transaction.vpRequest;
    const verifyOptions: VerifyOptionsDto = {
      challenge: vpRequest.challenge,
      proofPurpose: ProofPurpose.authentication,
      verificationMethod: verifiablePresentation.proof.verificationMethod as string //TODO: fix types here
    };
    const verifier = new VpRequestSubmissionVerifier(this.vcApiService, this.vcApiService);
    const { response, callback } = await transaction.processPresentation(verifiablePresentation, verifier);
    await this.transactionRepository.save(transaction);
    callback?.forEach((callback) => {
      // TODO: check if toDto is working. Seems be keeping it as Entity type.
      const body = TransactionDto.toDto(transaction);
      this.httpService.post(callback.url, body).subscribe({
        next: (v) => Logger.log(v),
        error: Logger.error
      });
    });
    return response;
  }

  public async getExchange(exchangeId: string): Promise<{ errors: string[]; exchange?: ExchangeEntity }> {
    const exchange = await this.exchangeRepository.findOne(exchangeId);
    if (!exchange) {
      return { errors: [`${exchangeId}: no exchange found for this transaction id`] };
    }
    return { errors: [], exchange: exchange };
  }

  public async getExchangeTransaction(
    transactionId: string
  ): Promise<{ errors: string[]; transaction?: TransactionEntity }> {
    const transaction = await this.transactionRepository.findOne(transactionId, {
      relations: ['vpRequest', 'presentationReview']
    });
    if (!transaction) {
      return { errors: [`${transactionId}: no transaction found for this transaction id`] };
    }
    const vpRequest = transaction.vpRequest;
    if (!vpRequest) {
      return {
        errors: [`${transactionId}: no vp-request associated this transaction id`]
      };
    }
    if (!transaction.exchangeId) {
      return { errors: [`${transactionId}: no exchange found for this transaction id`] };
    }
    return { errors: [], transaction: transaction };
  }

  public async addReview() {}
}
