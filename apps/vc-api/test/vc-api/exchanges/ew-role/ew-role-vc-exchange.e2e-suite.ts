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

import {
  VerifiableCredentialsServiceBase,
  getVerifiableCredentialsService,
  IssuerFields,
  fromPrivateKey,
  CacheClient,
  RoleCredentialSubject
} from 'iam-client-lib';
import {
  Credential,
  CredentialStatusPurpose,
  StatusListEntryType
} from '@ew-did-registry/credentials-interface';
import { Wallet, providers, utils } from 'ethers';
import axios from 'axios';
import { error } from 'console';
// import {} from '../../../../../../common/temp/node_modules/iam-client-lib/dist/src/modules/cache-client/cache-client.service'

const { id } = utils;

jest.mock('axios');
const getClaimsBySubject = jest.fn();
jest.mock('iam-client-lib/dist/src/modules/cache-client/cache-client.service', () => {
  return {
    CacheClient: jest.fn().mockImplementation(() => {
      return {
        getClaimsBySubject,
        addStatusToCredential: (
          credential: Credential<RoleCredentialSubject>
        ): Credential<RoleCredentialSubject> => {
          return {
            ...credential,
            credentialStatus: {
              id: `https://energyweb.org/credential/${id(JSON.stringify(credential))}#list`,
              type: StatusListEntryType.Entry2021,
              statusPurpose: CredentialStatusPurpose.REVOCATION,
              statusListIndex: '1',
              statusListCredential: `https://identitycache.org/v1/status-list/${credential.id}`
            }
          };
        }
      };
    })
  };
});

export const energywebRoleVCExchangeSure = () => {
  it('should be able to present Energy Web Role based VC', async () => {
    // As an holder, obtain EW Role verifiable credential

    const rpcUrl = 'https://volta-rpc.energyweb.org/';
    let provider = new providers.JsonRpcProvider(rpcUrl);

    const roleNamespace = 'test.ew.role.credential';

    let verifiableCredentialsService: VerifiableCredentialsServiceBase;
    let holderDID: string;
    const holderWallet = Wallet.createRandom();
    const holderAddress = holderWallet.address;

    const signerService = await fromPrivateKey(holderWallet.privateKey, rpcUrl);
    await signerService.publicKeyAndIdentityToken();
    holderDID = signerService.didHex;

    const cacheClient = new CacheClient(signerService);
    verifiableCredentialsService = await getVerifiableCredentialsService(signerService, cacheClient);

    const createExampleSignedCredential = async (issuerFields: IssuerFields[], expirationDate?: Date) => {
      return await verifiableCredentialsService.createRoleVC({
        id: holderDID,
        namespace: roleNamespace,
        version: '1',
        issuerFields,
        expirationDate
      });
    };
    const verifiableCredential = await createExampleSignedCredential([]);
    error('xxxxxxxxxxxxxx + vc creation');
    const verifiablePresentation = await verifiableCredentialsService.createVerifiablePresentation([
      verifiableCredential
    ]);
    console.log(verifiablePresentation);
  });
};
