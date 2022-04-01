import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IPresentation, IPresentationDefinition, PEX, ProofPurpose } from '@sphereon/pex';
import { ExchangeResponseDto } from '../dtos/exchange-response.dto';
import { PresentationReviewStatus } from '../types/presentation-review-status';
import { VerifiablePresentation } from '../../credentials/types/verifiable-presentation';
import { VpRequestInteractServiceType } from '../types/vp-request-interact-service-type';
import { VpRequestQueryType } from '../types/vp-request-query-type';
import { PresentationReviewEntity } from './presentation-review.entity';
import { VpRequestEntity } from './vp-request.entity';
import { CallbackConfiguration } from '../types/callback-configuration';
import { PresentationSubmissionEntity } from './presentation-submission.entity';
import { CredentialVerifier } from '../../credentials/types/credential-verifier';
import { PresentationVerifier } from '../../credentials/types/presentation-verifier';

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
        reviewStatus: PresentationReviewStatus.pending
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
  presentationSubmission: PresentationSubmissionEntity;

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
   * @param vp
   */
  public async processPresentation(
    vp: VerifiablePresentation,
    credentialVerifier: CredentialVerifier,
    presentationVerifier: PresentationVerifier
  ): Promise<{
    response: ExchangeResponseDto;
    callback: CallbackConfiguration[];
  }> {
    const verifyOptions = {
      challenge: this.vpRequest.challenge,
      proofPurpose: ProofPurpose.authentication,
      verificationMethod: vp.proof.verificationMethod as string //TODO: fix types here
    };
    const result = await presentationVerifier.verifyPresentation(vp, verifyOptions);
    if (!result.checks.includes('proof') || result.errors.length > 0) {
      return {
        response: {
          errors: [
            `${this.transactionId}: verification of presentation proof not successful`,
            ...result.errors
          ]
        },
        callback: []
      };
    }

    const errors = this.validatePresentation(vp);

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
      if (this.presentationReview.reviewStatus == PresentationReviewStatus.pending) {
        // In this case, this is the first submission to the exchange
        if (!this.presentationSubmission) {
          this.presentationSubmission = new PresentationSubmissionEntity(vp);
        }
        return {
          response: {
            errors: [],
            vpRequest: {
              challenge: uuidv4(),
              query: [{ type: VpRequestQueryType.didAuth, credentialQuery: [] }],
              interact: this.vpRequest.interact // Just ask the same endpoint again
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
      this.presentationSubmission = new PresentationSubmissionEntity(vp);
      return {
        response: {
          errors: []
        },
        callback: this.callback
      };
    }
  }
}
