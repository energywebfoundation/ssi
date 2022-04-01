import { IPresentation, IPresentationDefinition, PEX, ProofPurpose } from '@sphereon/pex';
import { CredentialVerifier } from './credentials/types/credential-verifier';
import { PresentationVerifier } from './credentials/types/presentation-verifier';
import { VerifiablePresentation } from './credentials/types/verifiable-presentation';
import { VpRequestEntity } from './exchanges/entities/vp-request.entity'; // Todo: have an interface instead of an entity
import { VpRequestQueryType } from './exchanges/types/vp-request-query-type';

/**
 * Inspired by https://github.com/gataca-io/vui-core/blob/6c599bdf7086f9a702e6657089fa343ae62a417a/service/validatorServiceDIFPE.go
 * Verifies:
 *  - Signatures/Proofs
 *  - Conformance with VpRequest (e.g. credential queries)
 *  - Authority of Issuer: TODO TODO TODO
 */
export class VpRequestSubmissionVerifier {
  constructor(
    private readonly credentialVerifier: CredentialVerifier,
    private readonly presentationVerifier: PresentationVerifier
  ) {}

  public async verifyPresention(vp: VerifiablePresentation, vpRequest: VpRequestEntity) {
    const proofErrors = await this.verifyPresentationProof(vp, vpRequest.challenge);
    const errors = this.validatePresentationAgainstVpRequest(vp, vpRequest);
    return [...proofErrors, ...errors];
  }

  private async verifyPresentationProof(vp: VerifiablePresentation, challenge: string) {
    const verifyOptions = {
      challenge,
      proofPurpose: ProofPurpose.authentication,
      verificationMethod: vp.proof.verificationMethod as string //TODO: fix types here
    };
    const result = await this.presentationVerifier.verifyPresentation(vp, verifyOptions);
    if (!result.checks.includes('proof') || result.errors.length > 0) {
      return [`verification of presentation proof not successful`, ...result.errors];
    }
    return [];
  }

  private validatePresentationAgainstVpRequest(
    presentation: VerifiablePresentation,
    vpRequest: VpRequestEntity
  ): string[] {
    const commonErrors = [];
    // Common checking
    if (presentation.proof.challenge !== vpRequest.challenge) {
      commonErrors.push('Challenge does not match');
    }

    // Type specific checking
    const partialErrors = vpRequest.query.flatMap((vpQuery) => {
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
}
