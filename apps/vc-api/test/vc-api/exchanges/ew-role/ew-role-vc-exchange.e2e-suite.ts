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
  CacheClient
} from 'iam-client-lib';
import { Wallet, providers } from 'ethers';

export const energywebRoleVCExchangeSure = () => {
  it('should be able to present Energy Web Role based VC', async () => {
    // As an holder, obtain EW Role verifiable credential

    const rpcUrl = 'http://volta-rpc.energyweb.org/';
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
    const verifiablePresentation = await verifiableCredentialsService.createVerifiablePresentation([
      verifiableCredential
    ]);
    console.log(verifiablePresentation);
  });
};
