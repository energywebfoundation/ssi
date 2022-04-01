/**
 * See "VerifyOptions" from
 * - https://w3c-ccg.github.io/vc-api/verifier.html#operation/verifyCredential
 * - https://w3c-ccg.github.io/vc-api/verifier.html#operation/verifyPresentation
 */
export interface VerifyOptions {
  challenge?: string;
  proofPurpose?: string;
}
