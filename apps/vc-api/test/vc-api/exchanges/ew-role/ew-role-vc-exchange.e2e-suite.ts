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

import { ProofPurpose } from '@sphereon/pex';
import {
  VerifiableCredentialsServiceBase,
  getVerifiableCredentialsService,
  fromPrivateKey,
  CacheClient
} from 'iam-client-lib';
import { Wallet, providers } from 'ethers';
import { error } from 'console';
import { vc } from './ew-role-vc';
import { PresentationDto } from 'src/vc-api/credentials/dtos/presentation.dto';
import { ProvePresentationOptionsDto } from 'src/vc-api/credentials/dtos/prove-presentation-options.dto';
import * as nock from 'nock';
import { app, getContinuationEndpoint, vcApiBaseUrl, walletClient } from '../../../app.e2e-spec';
import * as request from 'supertest';
import { EWRolePresentation } from './ew-role-presentation.exchange';
import { createPrivateKey } from 'crypto';
import { exportPKCS8, importJWK, KeyLike } from 'jose';
import * as openssl from 'openssl-nodejs';
import { ethers } from 'ethers';

const callbackUrlBase = 'http://example.com';
const callbackUrlPath = '/endpoint';
const callbackUrl = `${callbackUrlBase}${callbackUrlPath}`;

export const energywebRoleVCExchangeSuite = () => {
  it('should be able to present Energy Web Role based VC', async () => {
    // As an holder, obtain EW Role verifiable credential

    const rpcUrl = 'https://volta-rpc.energyweb.org/';
    let provider = new providers.JsonRpcProvider(rpcUrl);

    const roleNamespace = 'test.ew.role.credential';

    let verifiableCredentialsService: VerifiableCredentialsServiceBase;
    let holderDID: string;
    const holder = await walletClient.createDID('key');
    const holderKey = await walletClient.exportKey(holder.verificationMethod?.[0].publicKeyJwk?.kid);

    // importJWK from Jose returns KeyLike which can be used by exportPKCS8 to return pem
    // const keyLike = await importJWK(holderKey.privateKey, 'edDSA');
    // const privateKeyPem = await exportPKCS8(keyLike as KeyLike);
    // error("   ---------  "+ privateKeyPem)

    // createPrivateKey from crypto creates privateKey from pem, though it returns error due to base64
    // const privateKey = createPrivateKey({
    //   key: Buffer.from(privateKeyPem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''), 'base64'),
    //   type: 'pkcs8',
    //   format: 'der',
    // })

    // Tried direct conversion of pem to hexstring to see if it can be a workaround
    // const privateKey = Buffer.from(privateKeyPem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, '')).toString('hex');
    // const privateKey = createPrivateKey({key: privateKeyPem})

    // openssl converts pem to privateKey, it threw error as well
    // const privateKeyData = await openssl('rsa', ['-in', privateKeyPem, '-out', 'privateKeyFile']);
    // error("  +++++++++  " + privateKey)

    const holderWallet = new Wallet('jkjkjhlkjojkjkbnbkjnklnkllnkjnkjb', provider);
    const holderAddress = holderWallet.address;

    const signerService = await fromPrivateKey(holderWallet.privateKey, rpcUrl);
    await signerService.publicKeyAndIdentityToken();
    holderDID = signerService.didHex;
    const cacheClient = new CacheClient(signerService);
    verifiableCredentialsService = await getVerifiableCredentialsService(signerService, cacheClient);

    // const createExampleSignedCredential = async (issuerFields: IssuerFields[], expirationDate?: Date) => {
    //   return await verifiableCredentialsService.createRoleVC({
    //     id: holderDID,
    //     namespace: roleNamespace,
    //     version: '1',
    //     issuerFields,
    //     expirationDate
    //   });
    // };
    // const verifiableCredential = await createExampleSignedCredential(validEnergyWebRoleVC);
    // const verifiablePresentation = await verifiableCredentialsService.createVerifiablePresentation([
    //   vc
    // ]);

    // Configure presentation exchange
    // POST /exchanges
    const presentationExchange = new EWRolePresentation(callbackUrl);
    const presentationCallbackScope = nock(callbackUrlBase).post(callbackUrlPath).reply(201);
    const exchangeDef = presentationExchange.getExchangeDefinition();
    await request(app.getHttpServer()).post(`${vcApiBaseUrl}/exchanges`).send(exchangeDef).expect(201);

    // Start presentation exchange
    // POST /exchanges/{exchangeId}
    const exchangeEndpoint = `${vcApiBaseUrl}/exchanges/${presentationExchange.getExchangeId()}`;
    const presentationVpRequest = await walletClient.startExchange(
      exchangeEndpoint,
      presentationExchange.queryType
    );
    const presentationExchangeContinuationEndpoint = getContinuationEndpoint(presentationVpRequest);
    expect(presentationExchangeContinuationEndpoint).toContain(exchangeEndpoint);

    // Holder should parse VP Request for correct credentials...
    // Assume that holder figures out which VC they need and can prep presentation
    const presentation: PresentationDto = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [vc],
      holder: holderDID
    };
    const presentationOptions: ProvePresentationOptionsDto = {
      verificationMethod: `${holderDID}#controller`,
      proofPurpose: ProofPurpose.authentication,
      created: '2021-12-16T14:52:19.514Z',
      challenge: presentationVpRequest.challenge
    };
    const vp = await walletClient.provePresentation({ presentation, options: presentationOptions });

    // Holder submits presentation
    await walletClient.continueExchange(presentationExchangeContinuationEndpoint, vp, false);
    presentationCallbackScope.done();
  });
};
