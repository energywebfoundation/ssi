import { ProofPurpose } from '@sphereon/pex';
import { IsString, IsOptional } from 'class-validator';

/**
 * Parameters for verifying a verifiable credential or a verifiable presentation
 * https://w3c-ccg.github.io/vc-api/verifier.html#operation/verifyCredential
 * https://w3c-ccg.github.io/vc-api/verifier.html#operation/verifyPresentation
 */
export class VerifyOptionsDto {
  /**
   * The URI of the verificationMethod used for the proof. Default assertionMethod URI.
   */
  @IsString()
  @IsOptional()
  verificationMethod?: string;

  /**
   * The purpose of the proof. Default 'assertionMethod'.
   */
  @IsString()
  @IsOptional()
  proofPurpose?: ProofPurpose;

  /**
   * The date and time of the proof (with a maximum accuracy in seconds). Default current system time.
   */
  @IsString()
  @IsOptional()
  created?: string;

  /**
   * A challenge provided by the requesting party of the proof. For example 6e62f66e-67de-11eb-b490-ef3eeefa55f2
   */
  @IsString()
  @IsOptional()
  challenge?: string;

  /**
   * The intended domain of validity for the proof. For example website.example
   */
  @IsString()
  @IsOptional()
  domain?: string;
}
