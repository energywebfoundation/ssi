import { VerifiableCredential } from './verifiable-credential';
import { VerificationResult } from './verification-result';
import { VerifyOptions } from './verify-options';

export interface CredentialVerifier {
  verifyCredential: (vc: VerifiableCredential, options: VerifyOptions) => Promise<VerificationResult>;
}
