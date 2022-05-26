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

import { Test, TestingModule } from '@nestjs/testing';
import { keyToVerificationMethod } from '@spruceid/didkit-wasm-node';
import { CredentialsService } from './credentials.service';
import { IssueOptionsDto } from './dtos/issue-options.dto';
import { VerifyOptionsDto } from './dtos/verify-options.dto';
import { DIDService } from '../../did/did.service';
import { KeyService } from '../../key/key.service';
import { IPresentationDefinition, ProofPurpose } from '@sphereon/pex';
import { VerifiableCredential } from '../exchanges/types/verifiable-credential';
import { CredentialDto } from './dtos/credential.dto';
import {
  energyContractCredential,
  chargingDataVerifiableCredential,
  energyContractVerifiableCredential,
  chargingDataCredential,
  rebeamPresentation,
  presentationDefinition,
  rebeamVerifiablePresentation
} from '../../../test/vc-api/credential.service.spec.data';
import { challenge, did, key } from '../../../test/vc-api/credential.service.spec.key';
import { PresentationDto } from './dtos/presentation.dto';

describe('CredentialsService', () => {
  let service: CredentialsService;
  let didService: DIDService;
  let keyService: KeyService;
  let verificationMethod;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        {
          provide: DIDService,
          useValue: {
            getDID: jest.fn(),
            getVerificationMethod: jest.fn()
          }
        },
        {
          provide: KeyService,
          useValue: {
            getPrivateKeyFromKeyId: jest.fn()
          }
        }
      ]
    }).compile();

    didService = module.get<DIDService>(DIDService);
    keyService = module.get<KeyService>(KeyService);
    service = module.get<CredentialsService>(CredentialsService);
    verificationMethod = await keyToVerificationMethod('key', JSON.stringify(key));
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.each([
    [energyContractCredential, energyContractVerifiableCredential],
    [chargingDataCredential, chargingDataVerifiableCredential]
  ])(
    'credential %p can be issued to be a vc %p',
    async (credential: CredentialDto, expectedVc: VerifiableCredential) => {
      const issuanceOptions: IssueOptionsDto = {
        created: '2021-11-16T14:52:19.514Z'
      };
      jest.spyOn(didService, 'getDID').mockResolvedValueOnce(didDoc);
      jest.spyOn(didService, 'getVerificationMethod').mockResolvedValueOnce(didDoc.verificationMethod[0]);
      jest.spyOn(keyService, 'getPrivateKeyFromKeyId').mockResolvedValueOnce(key);
      const vc = await service.issueCredential({ credential, options: issuanceOptions });
      expect(vc['proof']['jws']).toBeDefined();
      /**
       * Delete jws from proof as it is not deterministic
       * TODO: confirm this from the Ed25519Signature2018 spec
       */
      console.log(vc.proof);
      delete vc.proof.jws;
      const expectedVcCopy = JSON.parse(JSON.stringify(expectedVc));
      delete expectedVcCopy.proof.jws;
      expect(vc).toEqual(expectedVcCopy);
    }
  );

  it('should be able to verify presentation of two credentials', async () => {
    const issuanceOptions: IssueOptionsDto = {
      proofPurpose: ProofPurpose.assertionMethod,
      verificationMethod,
      created: '2021-11-16T14:52:19.514Z'
    };
    jest.spyOn(didService, 'getVerificationMethod').mockResolvedValue({
      id: verificationMethod,
      type: 'some-verification-method-type',
      controller: did,
      publicKeyJwk: {
        kid: 'some-key-id',
        kty: 'OKP'
      }
    });

    jest.spyOn(keyService, 'getPrivateKeyFromKeyId').mockResolvedValue(key);
    const vc1 = await service.issueCredential({
      credential: energyContractCredential,
      options: issuanceOptions
    });
    const vc2 = await service.issueCredential({
      credential: chargingDataCredential,
      options: issuanceOptions
    });
    const presentation = service.presentationFrom(presentationDefinition as IPresentationDefinition, [
      vc1,
      vc2
    ]);
    const vp = await service.provePresentation({
      presentation,
      options: { proofPurpose: ProofPurpose.authentication, verificationMethod }
    });

    const verificationResult = await service.verifyPresentation(vp, {
      proofPurpose: ProofPurpose.authentication,
      verificationMethod
    });
    expect(verificationResult).toEqual({ checks: ['proof'], warnings: [], errors: [] });
  });

  it('should prove a vp', async () => {
    const presentationOptions: ProvePresentationOptionsDto = {
      verificationMethod: didDoc.verificationMethod[0].id,
      proofPurpose: ProofPurpose.authentication,
      created: rebeamVerifiablePresentation.proof.created
    };
    jest.spyOn(didService, 'getDID').mockResolvedValueOnce(didDoc);
    jest.spyOn(didService, 'getVerificationMethod').mockResolvedValueOnce(didDoc.verificationMethod[0]);
    jest.spyOn(keyService, 'getPrivateKeyFromKeyId').mockResolvedValueOnce(key);
    const vp = await service.provePresentation({ presentation, options: presentationOptions });
    expect(vc['proof']['jws']).toBeDefined();
    /**
     * Delete jws from proof as it is not deterministic
     * TODO: confirm this from the Ed25519Signature2018 spec
     */
    delete vp.proof.jws;
    const expectedVpCopy = JSON.parse(JSON.stringify(rebeamVerifiablePresentation));
    delete expectedVpCopy.proof.jws;
    expect(vp).toEqual(expectedVpCopy);
  });

  it('should be able to verify a credential', async () => {
    const verifyOptions: VerifyOptionsDto = {};
    const result = await service.verifyCredential(energyContractVerifiableCredential, verifyOptions);
    const expectedResult = { checks: ['proof'], warnings: [], errors: [] };
    expect(result).toEqual(expectedResult);
  });

  it('should be able to verify a presentation', async () => {
    const verifyOptions: VerifyOptionsDto = {
      proofPurpose: ProofPurpose.authentication,
      verificationMethod
    };
    const result = await service.verifyPresentation(rebeamVerifiablePresentation, verifyOptions);
    const expectedResult = { checks: ['proof'], warnings: [], errors: [] };
    expect(result).toEqual(expectedResult);
  });

  it('should be able to generate DIDAuth', async () => {
    const challenge = '2679f7f3-d9ff-4a7e-945c-0f30fb0765bd';
    const issuanceOptions: ProvePresentationOptionsDto = {
      verificationMethod: didDoc.verificationMethod[0].id,
      proofPurpose: ProofPurpose.authentication,
      created: '2021-11-16T14:52:19.514Z',
      challenge
    };
    jest.spyOn(didService, 'getDID').mockResolvedValueOnce(didDoc);
    jest.spyOn(didService, 'getVerificationMethod').mockResolvedValueOnce(didDoc.verificationMethod[0]);
    jest.spyOn(keyService, 'getPrivateKeyFromKeyId').mockResolvedValueOnce(key);
    const vp = await service.didAuthenticate({ did, options: issuanceOptions });
    expect(vp.holder).toEqual(did);
    expect(vp.proof).toBeDefined();
    const authVerification = await service.verifyPresentation(vp, { challenge });
    expect(authVerification.checks).toHaveLength(1);
    expect(authVerification.checks[0]).toEqual('proof');
    expect(authVerification.errors).toHaveLength(0);
  });
});
