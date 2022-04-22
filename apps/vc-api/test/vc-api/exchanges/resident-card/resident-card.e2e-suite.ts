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

import * as request from 'supertest';
import * as nock from 'nock';
import { IssueOptionsDto } from '../../../../src/vc-api/credentials/dtos/issue-options.dto';
import { ResidentCardIssuance } from './resident-card-issuance.exchange';
import { ProofPurpose } from '@sphereon/pex';
import { ResidentCardPresentation } from './resident-card-presentation.exchange';
import { app, getContinuationEndpoint, vcApiBaseUrl, walletClient } from '../../../app.e2e-spec';

export const residentCardExchangeSuite = () => {
  it('should support Resident Card issuance and presentation', async () => {
    // Configure credential issuance exchange
    // POST /exchanges
    const exchange = new ResidentCardIssuance();
    await request(app.getHttpServer())
      .post(`${vcApiBaseUrl}/exchanges`)
      .send(exchange.getExchangeDefinition())
      .expect(201);

    // As holder, start issuance exchange
    // POST /exchanges/{exchangeId}
    const issuanceExchangeEndpoint = `${vcApiBaseUrl}/exchanges/${exchange.getExchangeId()}`;
    const issuanceVpRequest = await walletClient.startExchange(issuanceExchangeEndpoint, exchange.queryType);
    const issuanceExchangeContinuationEndpoint = getContinuationEndpoint(issuanceVpRequest);
    expect(issuanceExchangeContinuationEndpoint).toContain(issuanceExchangeEndpoint);

    // As holder, create new DID and presentation to authentication as this DID
    // DID auth presentation: https://github.com/spruceid/didkit/blob/c5c422f2469c2c5cc2f6e6d8746e95b552fce3ed/lib/web/src/lib.rs#L382
    const holderDID = await walletClient.createDID('key');
    const holderVerificationMethod = holderDID.verificationMethod[0].id;
    const options: IssueOptionsDto = {
      verificationMethod: holderVerificationMethod,
      proofPurpose: ProofPurpose.authentication,
      challenge: issuanceVpRequest.challenge
    };
    const didAuthResponse = await request(app.getHttpServer())
      .post(`${vcApiBaseUrl}/presentations/prove/authentication`)
      .send({ did: holderDID.id, options })
      .expect(201);
    const didAuthVp = didAuthResponse.body;
    expect(didAuthVp).toBeDefined();

    // As holder, continue exchange by submitting did auth presention
    await walletClient.continueExchange(issuanceExchangeContinuationEndpoint, didAuthVp, true);

    // As the issuer, get the transaction
    const transactionId = issuanceExchangeContinuationEndpoint.split('/').at(-1);
    const transaction = await walletClient.getExchangeTransaction(exchange.getExchangeId(), transactionId);

    // TODO: have the issuer get the review and approve. For now, just issue directly
    const issueResult = await exchange.issueCredential(didAuthVp, walletClient);
    const issuedVc = issueResult.vp.verifiableCredential[0];
    expect(issuedVc).toBeDefined();

    // Configure presentation exchange
    // POST /exchanges
    const callbackUrlBase = 'http://example.com';
    const callbackUrlPath = '/endpoint';
    const presentationExchange = new ResidentCardPresentation(`${callbackUrlBase}${callbackUrlPath}`);
    const scope = nock(callbackUrlBase).post(callbackUrlPath).reply(201, { message: 'you did it!' });
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
    const presentation = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [issuedVc]
    };
    const issuanceOptions: IssueOptionsDto = {
      proofPurpose: ProofPurpose.authentication,
      verificationMethod: holderVerificationMethod,
      created: '2021-11-16T14:52:19.514Z',
      challenge: presentationVpRequest.challenge
    };
    const vp = await walletClient.provePresentation({ presentation, options: issuanceOptions });

    // Holder submits presentation
    await walletClient.continueExchange(presentationExchangeContinuationEndpoint, vp, false);
    scope.done();
  });
};
