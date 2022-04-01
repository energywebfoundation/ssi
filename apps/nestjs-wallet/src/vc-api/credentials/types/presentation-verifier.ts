import { VerifiablePresentation } from './verifiable-presentation';
import { VerificationResult } from './verification-result';
import { VerifyOptions } from './verify-options';

export interface PresentationVerifier {
  verifyPresentation: (vp: VerifiablePresentation, options: VerifyOptions) => Promise<VerificationResult>;
}
