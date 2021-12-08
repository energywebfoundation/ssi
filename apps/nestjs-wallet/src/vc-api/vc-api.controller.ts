import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VcApiService } from './vc-api.service';
import { IssueDto } from './dto/issue.dto';
import { VerifiableCredentialDto } from './dto/verifiable-credential.dto';

/**
 * VcApi API conforms to W3C vc-api
 * https://github.com/w3c-ccg/vc-api
 */
@ApiTags('vc-api')
@Controller('vc-api')
export class VcApiController {
  constructor(private vcApiService: VcApiService) {}

  /**
   * Issues a credential and returns it in the response body. Conforms to https://w3c-ccg.github.io/vc-api/issuer.html
   * @param issueDto credential without a proof, and, proof options
   * @returns a verifiable credential
   */
  @Post('credentials/issue')
  async issue(@Body() issueDto: IssueDto): Promise<VerifiableCredentialDto> {
    const privateKey = await this.vcApiService.getKeyForVerificationMethod(
      issueDto.options.verificationMethod
    );
    const vc = await this.vcApiService.issueCredential(issueDto.credential, issueDto.options, privateKey);
    return vc;
  }

  // VERIFIER https://w3c-ccg.github.io/vc-api/verifier.html

  // HOLDER https://w3c-ccg.github.io/vc-api/holder.html
}