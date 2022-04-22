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

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IPresentation, IPresentationDefinition, PEX } from '@sphereon/pex';
import { ExchangeResponseDto } from '../dtos/exchange-response.dto';
import { PresentationReviewStatus } from '../types/presentation-review-status';
import { VerifiablePresentation } from '../types/verifiable-presentation';
import { VpRequestInteractServiceType } from '../types/vp-request-interact-service-type';
import { VpRequestQueryType } from '../types/vp-request-query-type';
import { PresentationReviewEntity } from './presentation-review.entity';
import { VpRequestEntity } from './vp-request.entity';
import { CallbackConfiguration } from '../types/callback-configuration';
import { PresentationSubmissionEntity } from './presentation-submission.entity';

/**
 * A TypeOrm entity representing an exchange transaction
 * https://w3c-ccg.github.io/vc-api/#exchange-examples
 *
 * Some discussion regarding the rational behind the names:
 * https://github.com/w3c-ccg/vc-api/pull/262#discussion_r805895143
 */
@Entity()
export class TransactionEntity {
  constructor(
    transactionId: string,
    exchangeId: string,
    vpRequest: VpRequestEntity,
    callback: CallbackConfiguration[]
  ) {
    this.transactionId = transactionId;
    this.exchangeId = exchangeId;
    this.vpRequest = vpRequest;
    if (vpRequest?.interact?.service[0]?.type === VpRequestInteractServiceType.mediatedPresentation) {
      this.presentationReview = {
        presentationReviewId: uuidv4(),
        reviewStatus: PresentationReviewStatus.pendingSubmission
      };
    }
    this.callback = callback;
  }

  /**
   * An id for the transaction
   */
  @Column('text', { primary: true })
  transactionId: string;

  /**
   * VP Requests are defined here: https://w3c-ccg.github.io/vp-request-spec/
   */
  @OneToOne(() => VpRequestEntity, {
    cascade: true
  })
  @JoinColumn()
  vpRequest: VpRequestEntity;

  /**
   */
  @OneToOne(() => PresentationReviewEntity, {
    cascade: true,
    nullable: true
  })
  @JoinColumn()
  presentationReview?: PresentationReviewEntity;

  /**
   * Each transaction is a part of an exchange execution
   * https://w3c-ccg.github.io/vc-api/#exchange-examples
   */
  @Column('text')
  exchangeId: string;

  /**
   */
  @OneToOne(() => PresentationSubmissionEntity, {
    cascade: true,
    nullable: true
  })
  @JoinColumn()
  presentationSubmission?: PresentationSubmissionEntity;

  @Column('simple-json')
  callback: CallbackConfiguration[];

  private verifyVpRequestTypeDidAuth(presentation: VerifiablePresentation): string[] {
    // https://w3c-ccg.github.io/vp-request-spec/#did-authentication-request
    const errors: string[] = [];

    if (!presentation.holder) {
      errors.push('Presentation holder is required for didAuth query');
    }

    return errors;
  }

  private verifyVpRequestTypePresentationDefinition(
    presentation: VerifiablePresentation,
    credentialQuery: Array<{ presentationDefinition: IPresentationDefinition }>
  ): string[] {
    // https://identity.foundation/presentation-exchange/#presentation-definition
    const errors: string[] = [];
    const pex: PEX = new PEX();

    credentialQuery.forEach(({ presentationDefinition }, index) => {
      const { errors: partialErrors } = pex.evaluatePresentation(
        presentationDefinition,
        presentation as IPresentation
      );

      errors.push(
        ...partialErrors.map(
          (error) =>
            `Presentation definition (${index + 1}) validation failed, reason: ${error.message || 'Unknown'}`
        )
      );
    });

    return errors;
  }

  private validatePresentation(presentation: VerifiablePresentation): string[] {
    const commonErrors = [];
    // Common checking
    if (presentation.proof.challenge !== this.vpRequest.challenge) {
      commonErrors.push('Challenge does not match');
    }

    // Type specific checking
    const partialErrors = this.vpRequest.query.flatMap((vpQuery) => {
      switch (vpQuery.type) {
        case VpRequestQueryType.didAuth:
          return this.verifyVpRequestTypeDidAuth(presentation);
        case VpRequestQueryType.presentationDefinition:
          return this.verifyVpRequestTypePresentationDefinition(presentation, vpQuery.credentialQuery);
        default:
          return ['Unknown request query type'];
      }
    });

    return [...partialErrors, ...commonErrors];
  }

  /**
   * Process a presentation submission.
   * Check the correctness of the presentation against the VP Request Credential Queries.
   * Does NOT check signatures.
   * @param presentation
   */
  public processPresentation(presentation: VerifiablePresentation): {
    response: ExchangeResponseDto;
    callback: CallbackConfiguration[];
  } {
    const errors = this.validatePresentation(presentation);

    if (errors.length > 0) {
      return {
        response: {
          errors
        },
        callback: []
      };
    }

    const service = this.vpRequest.interact.service[0]; // TODO: Not sure how to handle multiple interaction services
    if (service.type == VpRequestInteractServiceType.mediatedPresentation) {
      if (this.presentationReview.reviewStatus == PresentationReviewStatus.pendingSubmission) {
        // Don't overwrite a previous submitted submission
        if (!this.presentationSubmission) {
          this.presentationSubmission = new PresentationSubmissionEntity(presentation);
        }
        this.presentationReview.reviewStatus = PresentationReviewStatus.pendingReview;
        return {
          response: {
            errors: [],
            vpRequest: {
              challenge: uuidv4(),
              query: [],
              interact: this.vpRequest.interact // Holder should query the same endpoint again to check if it has been reviewed
            }
          },
          callback: []
        };
      }
      if (this.presentationReview.reviewStatus == PresentationReviewStatus.approved) {
        if (this.presentationReview.VP) {
          return {
            response: {
              errors: [],
              vp: this.presentationReview.VP
            },
            callback: []
          };
        } else {
          return {
            response: {
              errors: []
            },
            callback: []
          };
        }
      }
    }
    if (service.type == VpRequestInteractServiceType.unmediatedPresentation) {
      this.presentationSubmission = new PresentationSubmissionEntity(presentation);
      return {
        response: {
          errors: []
        },
        callback: this.callback
      };
    }
  }
}
