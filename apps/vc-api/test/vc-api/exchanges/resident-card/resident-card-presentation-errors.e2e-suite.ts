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
import { ResidentCardPresentation } from './resident-card-presentation.exchange';
import { app, getContinuationEndpoint, vcApiBaseUrl, walletClient } from '../../../app.e2e-spec';
import { VerifiablePresentation } from 'src/vc-api/exchanges/types/verifiable-presentation';

const callbackUrlBase: string = 'http://example.com';
const callbackUrlPath: string = '/endpoint';
const callbackUrl: string = `${callbackUrlBase}${callbackUrlPath}`;

const vp: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1', 'https://w3id.org/citizenship/v1'],
      id: 'https://issuer.oidp.uscis.gov/credentials/83627465',
      type: ['VerifiableCredential', 'PermanentResidentCard'],
      credentialSubject: {
        id: 'did:key:z6MktMqxfjCxbTjiB8HZcuZTsz7Po5CEfCfdxoQJwATKh6hq',
        residentSince: '2015-01-01',
        image: 'data:image/png;base64,iVBORw0KGgo...kJggg==',
        lprCategory: 'C09',
        gender: 'Male',
        type: ['PermanentResident', 'Person'],
        commuterClassification: 'C1',
        givenName: 'JOHN',
        familyName: 'SMITH',
        birthDate: '1958-07-17',
        lprNumber: '999-999-999',
        birthCountry: 'Bahamas'
      },
      issuer: 'did:key:z6MkeVQ1ZkR6x6PCXVX4Ue1extTJPitfoGeqmTz5W2EzAFHY',
      issuanceDate: '2019-12-03T12:19:52Z',
      proof: {
        type: 'Ed25519Signature2018',
        proofPurpose: 'assertionMethod',
        verificationMethod:
          'did:key:z6MkeVQ1ZkR6x6PCXVX4Ue1extTJPitfoGeqmTz5W2EzAFHY#z6MkeVQ1ZkR6x6PCXVX4Ue1extTJPitfoGeqmTz5W2EzAFHY',
        created: '2022-06-29T10:59:50.739Z',
        jws: 'eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..u0Uap0_sYZSfQ_JGjEkQvWiv4hbgokmZmFl8HjfVdOkoJWGPOkt_zgkvOLAoMDNFGXcejN6z8nLicVWGELVXAw'
      },
      expirationDate: '2029-12-03T12:19:52Z'
    }
  ],
  proof: {
    type: 'Ed25519Signature2018',
    proofPurpose: 'authentication',
    challenge: 'f3d0d3f4-7f88-4bd3-aa99-a2501b360ce9',
    verificationMethod:
      'did:key:z6MktMqxfjCxbTjiB8HZcuZTsz7Po5CEfCfdxoQJwATKh6hq#z6MktMqxfjCxbTjiB8HZcuZTsz7Po5CEfCfdxoQJwATKh6hq',
    created: '2021-11-16T14:52:19.514Z',
    jws: 'eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..FeaAQkvSoX4aRDlXlKLxlqDQb-XvWQ0hioMVNJMuiki4wRcQ_0y3Fo7Sbhj6emRCjub9jfDorQmG7Ix5Q1E2Aw'
  },
  holder: 'did:key:z6MktMqxfjCxbTjiB8HZcuZTsz7Po5CEfCfdxoQJwATKh6hq'
};

export const residentCardPresentationErrorsSuite = () => {
  it('should return error if Resident Card presentation is missing credentials', async () => {
    // Configure presentation exchange
    const presentationExchange = new ResidentCardPresentation(callbackUrl);
    const presentationCallbackScope = nock(callbackUrlBase).post(callbackUrlPath).reply(201);
    const exchangeDef = presentationExchange.getExchangeDefinition();
    await request(app.getHttpServer()).post(`${vcApiBaseUrl}/exchanges`).send(exchangeDef).expect(201);

    // Start presentation exchange
    const exchangeEndpoint = `${vcApiBaseUrl}/exchanges/${presentationExchange.getExchangeId()}`;
    const presentationVpRequest = await walletClient.startExchange(
      exchangeEndpoint,
      presentationExchange.queryType
    );
    const presentationExchangeContinuationEndpoint = getContinuationEndpoint(presentationVpRequest);
    expect(presentationExchangeContinuationEndpoint).toContain(exchangeEndpoint);

    // Holder submits presentation
    const vpWithIncorrectProof = {
      ...vp,
      proof: {
        ...vp.proof,
        challenge: presentationVpRequest.challenge,
        jws: 'an-invalid-jws'
      }
    };
    await walletClient.continueExchange(
      presentationExchangeContinuationEndpoint,
      vpWithIncorrectProof,
      false
    );
    presentationCallbackScope.done();
  });
};
