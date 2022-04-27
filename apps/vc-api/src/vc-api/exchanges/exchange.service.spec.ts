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

import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Entity, Repository } from 'typeorm';
import { ExchangeEntity } from './entities/exchange.entity';
import { VpRequestEntity } from './entities/vp-request.entity';
import { ExchangeService } from './exchange.service';
import { ExchangeDefinitionDto } from './dtos/exchange-definition.dto';
import { VpRequestInteractServiceType } from './types/vp-request-interact-service-type';
import { TransactionEntity } from './entities/transaction.entity';
import { VpRequestQueryType } from './types/vp-request-query-type';
import { ConfigService } from '@nestjs/config';
import { ReviewResult, SubmissionReviewDto } from './dtos/submission-review.dto';
import { VpSubmissionVerifierService } from './vp-submission-verifier.service';
import { SubmissionVerifier } from './types/submission-verifier';

const baseUrl = 'https://test-exchange.com';
const exchangeId = 'test-exchange';
const vp = {
  '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [],
  holder: 'did:key:z6MksBH4LMy8SoYFUNjDXtQ2Rq4dHnyuemowxXqzLpuB6nvc',
  proof: {}
};

const submissionVerificationResult = {
  checks: ['proof'],
  warnings: [],
  errors: []
};

const mockSubmissionVerifier: SubmissionVerifier = {
  verifyVpRequestSubmission: jest.fn().mockResolvedValue(submissionVerificationResult)
};

describe('ExchangeService', () => {
  let service: ExchangeService;

  let transaction: TransactionEntity;
  // https://stackoverflow.com/a/55366343
  const transactionRepositoryMockFactory = jest.fn(() => ({
    findOne: jest.fn(() => transaction),
    save: jest.fn((entity) => {
      transaction = entity;
    })
  }));
  let exchange: ExchangeEntity;
  const repositoryMockFactory = jest.fn(() => ({
    findOne: jest.fn(() => exchange),
    save: jest.fn((entity) => {
      exchange = entity;
    })
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ExchangeService,
        {
          provide: VpSubmissionVerifierService,
          useValue: mockSubmissionVerifier
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return baseUrl;
            })
          }
        },
        { provide: getRepositoryToken(TransactionEntity), useFactory: transactionRepositoryMockFactory },
        { provide: getRepositoryToken(ExchangeEntity), useFactory: repositoryMockFactory }
      ]
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createExchange', () => {
    it('should accept a presentation definition in an exchange definition', async () => {
      const presentationDefinition = {
        id: '57ca126c-acbf-4da4-8f79-447150e93128',
        input_descriptors: [
          {
            id: 'permanent_resident_card',
            name: 'Permanent Resident Card',
            purpose: 'We can only allow permanent residents into the application'
          }
        ]
      };
      const exchangeDef = {
        exchangeId: 'permanent-resident-card-presentation',
        query: [
          {
            type: VpRequestQueryType.presentationDefinition,
            credentialQuery: [{ presentationDefinition }]
          }
        ],
        interactServices: [
          {
            type: VpRequestInteractServiceType.unmediatedPresentation,
            baseUrl: 'https://example.org/'
          }
        ],
        isOneTime: false,
        callback: []
      };
      const result = await service.createExchange(exchangeDef);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('startExchange', () => {
    it('should start exchange from an exchange definition', async () => {
      const exchangeId = 'test-exchange';
      const exchangeDef: ExchangeDefinitionDto = {
        exchangeId: exchangeId,
        interactServices: [
          {
            type: VpRequestInteractServiceType.unmediatedPresentation
          }
        ],
        query: [],
        isOneTime: false,
        callback: []
      };
      await service.createExchange(exchangeDef);
      const exchangeResponse = await service.startExchange(exchangeId);
      expect(exchangeResponse.vpRequest.interact.service).toHaveLength(1);
      expect(exchangeResponse.vpRequest.interact.service[0].serviceEndpoint).toContain(baseUrl);
    });
  });

  describe('continueExchange', () => {
    // TODO: Write after https://github.com/energywebfoundation/ssi/pull/46 as this will make it easier to test
    it.skip('should send transaction dto if callback is configured', async () => {
      // const exchangeDef: ExchangeDefinitionDto = {
      //   exchangeId: exchangeId,
      //   interactServices: [
      //     {
      //       type: VpRequestInteractServiceType.unmediatedPresentation
      //     }
      //   ],
      //   query: [],
      //   isOneTime: false,
      //   callback: []
      // };
      // const exchangeResponse = await service.continueExchange(vp, transactionId);
      // expect(exchangeResponse.vpRequest.interact.service).toHaveLength(1);
      // expect(exchangeResponse.vpRequest.interact.service[0].serviceEndpoint).toContain(baseUrl);
    });
  });

  describe('addReview', () => {
    it('should allow addition of review', async () => {
      const exchangeDef: ExchangeDefinitionDto = {
        exchangeId: exchangeId,
        interactServices: [
          {
            type: VpRequestInteractServiceType.mediatedPresentation
          }
        ],
        query: [],
        isOneTime: true,
        callback: []
      };
      await service.createExchange(exchangeDef);
      const exchangeResponse = await service.startExchange(exchangeId);
      const transactionId = exchangeResponse.vpRequest.interact.service[0].serviceEndpoint.split('/').pop();
      await service.continueExchange(vp, transactionId);

      const reviewDto: SubmissionReviewDto = {
        result: ReviewResult.approved
      };
      await service.addReview(transactionId, reviewDto);
      expect(transaction.presentationReview.reviewStatus).toEqual(ReviewResult.approved);
      expect(transaction.presentationReview.VP).toBeUndefined();
    });
  });
});
