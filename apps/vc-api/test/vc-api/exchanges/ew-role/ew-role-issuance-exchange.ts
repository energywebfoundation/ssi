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

import { plainToClass } from 'class-transformer';
import { WalletClient } from '../../../wallet-client';
import { VerifiablePresentationDto } from '../../../../src/vc-api/credentials/dtos/verifiable-presentation.dto';
import { CredentialDto } from '../../../../src/vc-api/credentials/dtos/credential.dto';
import { Presentation } from '../../../../src/vc-api/exchanges/types/presentation';
import { ExchangeDefinitionDto } from '../../../../src/vc-api/exchanges/dtos/exchange-definition.dto';
import { VpRequestInteractServiceType } from '../../../../src/vc-api/exchanges/types/vp-request-interact-service-type';
import { VpRequestQueryType } from '../../../../src/vc-api/exchanges/types/vp-request-query-type';
import { ProvePresentationOptionsDto } from '../../../../src/vc-api/credentials/dtos/prove-presentation-options.dto';
import { completeIssueCredential, prepareIssueCredential } from '@spruceid/didkit-wasm-node';
import {
  CredentialStatusPurpose,
  CredentialType,
  StatusListEntryType,
  VerifiableCredential
} from '@ew-did-registry/credentials-interface';
import { proofOptions, keyType } from './ew-role-vc';
import { error } from 'console';
import { fromPrivateKey, RoleCredentialSubject, SignerService } from 'iam-client-lib';

export class ResidentCardIssuance {
  #exchangeId = 'ew-role-issuance';
  #callbackUrl: string;
  queryType = VpRequestQueryType.didAuth;

  constructor(callbackUrl: string) {
    this.#callbackUrl = callbackUrl;
  }

  getExchangeId(): string {
    return this.#exchangeId;
  }

  getExchangeDefinition(): ExchangeDefinitionDto {
    const exchangeDefinition: ExchangeDefinitionDto = {
      exchangeId: this.#exchangeId,
      query: [
        {
          type: this.queryType,
          credentialQuery: []
        }
      ],
      interactServices: [
        {
          type: VpRequestInteractServiceType.mediatedPresentation
        }
      ],
      isOneTime: false,
      callback: [
        {
          url: this.#callbackUrl
        }
      ]
    };
    return plainToClass(ExchangeDefinitionDto, exchangeDefinition);
  }

  /**
   *
   * TODO: get and approve presentation review
   * @param vp
   * @param walletClient
   * @returns
   */
  async issueCredential(vp: VerifiablePresentationDto, walletClient: WalletClient) {
    let signerService = await fromPrivateKey(
      '22dc144318961ebe99d19c12f44ea10439a942585e6e7d93c0b4a06397dcd138',
      'https://volta-rpc.energyweb.org/'
    );
    if (!vp.holder) {
      return { errors: ['holder of vp not provided'] };
    }
    const issuingDID = await walletClient.createDID('key');
    const credentialObject = this.createCredentialObject(issuingDID.id, vp.holder);
    const stringifyCredential = JSON.stringify(credentialObject);
    let proofOptionsObject = proofOptions;
    proofOptionsObject.verificationMethod = `${vp.holder}#controller`;
    const preparedVC = await prepareIssueCredential(
      stringifyCredential,
      JSON.stringify(proofOptionsObject),
      JSON.stringify(keyType)
    );

    const preparation = JSON.parse(preparedVC);

    const typedData = preparation.signingInput;
    delete typedData.types['EIP712Domain'];

    const signature = await signerService.signTypedData(typedData.domain, typedData.types, typedData.message);

    const signedCredential = await completeIssueCredential(stringifyCredential, preparedVC, signature);

    const verifiableCredential = JSON.parse(signedCredential) as VerifiableCredential<RoleCredentialSubject>;

    const presentation: Presentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [verifiableCredential]
    };
    const verificationMethodURI = issuingDID?.verificationMethod[0]?.id;
    if (!verificationMethodURI) {
      return { errors: ['verification method for issuance not available'] };
    }
    const presentationOptions: ProvePresentationOptionsDto = {
      verificationMethod: verificationMethodURI
    };
    const provePresentationDto = {
      options: presentationOptions,
      presentation
    };
    const returnVp = await walletClient.provePresentation(provePresentationDto);
    return {
      errors: [],
      vp: returnVp
    };
  }

  private createCredentialObject(issuingDID: string, holderDID: string): CredentialDto {
    return {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
      type: [CredentialType.VerifiableCredential, CredentialType.EWFRole],
      issuer: issuingDID,
      issuanceDate: '2019-12-03T12:19:52Z',
      expirationDate: '2029-12-03T12:19:52Z',
      credentialSubject: {
        id: holderDID,
        issuerFields: [],
        role: { namespace: 'test.iam.ewc', version: '1' }
      },
      credentialStatus: {
        id: 'https://energyweb.org/credential/0x760b59d40ca5be5d197f82df5f7acb8ecaecd5d03c38f91f909e7456ae464430#list',
        type: StatusListEntryType.Entry2021,
        statusListIndex: '1',
        statusPurpose: CredentialStatusPurpose.REVOCATION,
        statusListCredential:
          'https://identitycache.org/v1/status-list/urn:uuid:1feb8928-cdad-4f36-9096-e854151cfef4'
      }
    };
  }
}
