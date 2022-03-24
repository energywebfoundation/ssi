import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { VpRequestDto } from './vp-request.dto';

export class TransactionDto {
  /**
   * An id for the transaction
   */
  transactionId: string;

  /**
   * Each transaction is a part of an exchange
   * https://w3c-ccg.github.io/vc-api/#exchange-examples
   */
  @IsString()
  exchangeId: string;

  /**
   * https://w3c-ccg.github.io/vp-request-spec/
   */
  @ValidateNested()
  vpRequest: VpRequestDto;

  /**
   * The Verifiable Presentation submitted in response to the VP Request
   */
  @Column('simple-json', { nullable: true })
  submittedVP?: VerifiablePresentation;
}
