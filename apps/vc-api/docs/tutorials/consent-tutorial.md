<!--
 Copyright 2021, 2022 Energy Web Foundation
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

# Consent Tutorial

## Business overview
The business objective of this tutorial is to demonstrate request signed consent from a DID in the form of a Verifiable Credential (VC).

### Business workflows
TODO. See [business workflows from consenter-card tutorial](./consenter-card-tutorial.md#business-workflows)

## Technical overview
From a technical point of view, in this tutorial, we have access to the server API but no mobile wallet is available. So we will use the server API for both roles of the portal and the consent providers's mobile wallet.

### Technical workflows

The technical workflow is as follows:
- [1.1  [Consent-Requesting portal] Configure the consent exchange](#11-authority-portal-configure-the-credential-issuance-exchange)
- [1.2  [Consent-Requesting portal] Provide an exchange invitation to the citizen](#12-authority-portal-provide-an-exchange-invitation-to-the-citizen)
- [1.3  [Consenter] Initiate exchange using the request URL](#13-consenter-initiate-issuance-exchange-using-the-request-url)
- [1.4  [Consenter] Create a DID](#14-consenter-create-a-did)
- [1.5  [Consenter] Create a DID authentication proof](#15-consenter-create-a-did-authentication-proof)
- [1.6  [Consenter] Continue exchange by submitting the DID Auth proof](#16-consenter-continue-exchange-by-submitting-the-did-auth-proof)
- [1.7  [Consent-Requesting portal] Check for notification of submitted presentation](#17-authority-portal-check-for-notification-of-submitted-presentation)
- [1.8  [Consent-Requesting portal] Create issuer DID](#18-authority-portal-create-issuer-did)
- [1.9  [Consent-Requesting portal] Issue "consenter card" credential](#19-authority-portal-issue-consenter-card-credential)
- [1.10 [Consent-Requesting portal] Wrap the issued VC in a VP](#110-authority-portal-wrap-the-issued-vc-in-a-vp)
- [1.11 [Consent-Requesting portal] Add a review to the exchange](#111-authority-portal-add-a-review-to-the-exchange)
- [1.12 [Consenter] Continue the exchange and obtain the credentials](#112-consenter-continue-the-exchange-and-obtain-the-credentials)

#### 2. Presentation workflow
- [2.1  [Verifier] Configure Credential Exchange](#21-verifier-configure-credential-exchange)
- [2.2  [Verifier] Provide an exchange invitation to the consenter](#22-verifier-provide-an-exchange-invitation-to-the-consenter)
- [2.3  [Consenter] Initiate the presentation exchange](#23-consenter-initiate-the-presentation-exchange)
- [2.4  [Consenter] Create the required presentation](#24-consenter-create-the-required-presentation)
- [2.5  [Consenter] Continue the exchange](#25-consenter-continue-the-exchange)
- [2.6 [Verifier] Act on Submitted Presentation](#26-verifier-act-on-submitted-presentation)

## Overview and Objective

The objective of this tutorial is walk through a simple credential issuance and presentation flow.
A diagram of this flow is available in the [Exchanges Documentation](../exchanges.md).

## Steps
### 0. Setup the Postman Collection

First, download and install [Postman](https://www.postman.com/downloads/).

Then, from the Postman app, import [the open-api json](../openapi.json) and [the environment](../vc-api.postman_environment.json) for the Nest.js wallet. Instructions on how to import into Postman can be found [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

### 1. Permanent Consenter Card issuance

#### 1.1 [Consent-Requesting portal] Configure the credential issuance exchange

The authority portal needs to configure the parameters of the permanent consenter card issuance exchange by sending an [Exchange Definition](../exchanges.md#exchange-definitions).
To do this, navigate to the `Vc Api Controller create Exchange` under `vc-api/exchanges` and send the request described below.

**Request URL**

`{VC API base url}/vc-api/exchanges`

**HTTP Verb**

`POST`

**Request Body**

Fill in the `exchangeId` with a unique id, such as a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

Note the `interactService` `type` of `MediatedHttpPresentationService2021`.
See the [exchanges documentation](../exchanges.md#mediated-exchange-interactions) for information about mediated exchanges.

In order to test the notification functionality, you can use the "[Post Test Server](http://ptsv2.com/)".
This is a free website which allows you to view sent HTTP POST requests.
With this service, requests are saved to a dedicated location for later review.
Please only use this service for this tutorial (or other non-production applications).

To use the "Post Test Server" service with this tutorial, create a new request bucket from the website home page.
Then, in the resulting page, copy the POST URL, including the domain, into the exchange definition below.
Creating a new request bucket is to help you be sure that you are looking at the requests you (and not others) have created.

```json
{
    "exchangeId": "<FILL WITH SOME UNIQUE ID>",
    "query": [
      {
        "type": "DIDAuth",
        "credentialQuery": []
      }
    ],
    "interactServices": [
      {
        "type": "MediatedHttpPresentationService2021"
      }
    ],
    "callback": [
      {
        "url": "FILL YOUR BUCKET POST URL, for example 'http://ptsv2.com/t/ebitx-1652373826/post'"
      }
    ],
    "isOneTime":true
}
```
**Sample Expected Response Body**

```json
{
    "errors": []
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.2 [Consent-Requesting portal] Provide an exchange invitation to the citizen

The authority portal can communicate to the citizen that they can initiate request for a "PermanentConsenterCard" credential by
filling the `exchange id` in the json template below and transmitting the json to the citizen.
They can do this transmission by encoding the json in a QR code and displaying to the citizen for example.

```json
{
    "outOfBandInvitation": { 
        "type": "https://energyweb.org/out-of-band-invitation/vc-api-exchange",
        "body": { 
            "credentialTypeAvailable": "PermanentConsenterCard",
            "url": "http://localhost:3000/vc-api/exchanges/{THE EXCHANGE ID FROM THE PREVIOUS STEP}" 
        }
    }
} 
```

#### 1.3 [Consenter] Initiate issuance exchange using the request URL

Initiate a request for a PermanentConsenterCard by POSTing to the `url` directly in Postman or by navigating to the `Vc Api Controller initiate Exchange` request in the collection.

Send the request as described below.

**Request URL**

If using the collection request, fill in the `exchangeid` param to be the exchange ID used in the first step.
`{VC API base url}/vc-api/exchanges/{exchangeId}`

**HTTP Verb**

`POST`

**Request Body**

*empty*

**Sample Expected Response Body**

The response contains a VP Request, which is a specification defined here: https://w3c-ccg.github.io/vp-request-spec/.
You can see that the VP Request's `query` section contains a `DIDAuth` query.
This means that we must authenticate as our chosen DID in order to obtain the credential that we requested.

The `challenge` value and the final fragment of the `serviceEndpoint`, which is the `transaction id`, should be different from the sample below.

Also note the `service` in the `interact` section of the VP Request.
This is providing the location at which we can continue the credential exchange once we have met the `query` requirements.

```json
{
    "errors": [],
    "vpRequest": {
        "challenge": "57ca126c-acbf-4da4-8f79-447150e93128",
        "query": [
            {
                "type": "DIDAuth",
                "credentialQuery": []
            }
        ],
        "interact": {
            "service": [
                {
                    "type": "MediatedHttpPresentationService2021",
                    "serviceEndpoint": "http://localhost:3000/exchanges/consenter-card-issuance-82793/55fb5bc5-4f5f-40c8-aa8d-f3a1991637fc"
                }
            ]
        }
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.4 [Consenter] Create a DID

Let's create a new DID for which the citizen can prove control.
This DID will be the Subject identifier of the Consenter Card credential.

Navigate to the `DID Controller create` request under the `did` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/did`

**HTTP Verb**

`POST`

**Request Body**

```json
{
    "method": "key"
}
```

**Sample Expected Response Body**

Response body should be similar to the one below but with a different `did`.
```json
{
    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
    "verificationMethod": [
        {
            "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
            "publicKeyJwk": {
                "crv": "Ed25519",
                "x": "7qB2-hwO1ajv4CaLjfK7iB13JPUdGLObB8JGjy95KI0",
                "kty": "OKP",
                "kid": "i9CHqa1zwV23F8sxGszjXB53SnB-gKO7aL9hDcmA-ho"
            }
        }
    ]
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.5 [Consenter] Create a DID authentication proof

In order to prove control over the DID created in the previous step, create a DID Authentication proof.

Open the `Vc Api Controller prove Authentication Presentation` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/vc-api/presentations/prove/authentication`

**HTTP Verb**

`POST`

**Request Body**

Fill the json below with your own values.
The `challenge` should be value received from the VP Request in the previous step.

```json
{
    "did": "FILL YOUR DID HERE",
    "options": {
        "verificationMethod": "FILL YOUR VERIFICATION METHOD HERE",
        "proofPurpose": "authentication",
        "challenge": "FILL YOUR CHALLENGE HERE"
    }
}
```

An example filed body is shown below.
```json
{
    "did": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
    "options": {
        "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
        "proofPurpose": "authentication",
        "challenge": "c2e806b4-35ed-409b-bc3a-b849d7c2b204"
    }
}
```

**Sample Expected Response Body**

The response should be a verifiable presentation, similar to the one below.
```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": "VerifiablePresentation",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "authentication",
        "challenge": "c2e806b4-35ed-409b-bc3a-b849d7c2b204",
        "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
        "created": "2022-04-29T09:25:55.969Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..51vek0DLAcdL2DxMRQlOFfFz306Y-EDvqhWYzCInU9UYFT_HQZHW2udSeX2w35Nn-JO4ouhJFeiM8l3e2sEEBQ"
    },
    "holder": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A"
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.6 [Consenter] Continue exchange by submitting the DID Auth proof

Continue the exchange using the DIDAuth presentation.
To do this, open the `Vc Api Controller continue Exchange` request in the `vc-api/exchanges/{exchange id}/{transaction id}` folder.

Send the request as described below.

**Request URL**

In the request params, use the `transactionId` from the `serviceEndpoint` in the VP Request and `exchangeId` as the unique exchange ID configued in the initial step.

`{VC API base url}/vc-api/exchanges/{EXCHANGE ID}/{TRANSACTION ID}`

**HTTP Verb**

`PUT`

**Request Body**

In the request body, copy the VP that was obtained from the previous step.

**Sample Expected Response Body**

The response should be similar to as shown below.
This response indicates that the client attempt to continue the exchange again (after some interval), using the service endpoint.
```json
{
    "errors": [],
    "vpRequest": {
        "challenge": "08070970-638c-4b43-91bd-08325b08cc4a",
        "query": [],
        "interact": {
            "service": [
                {
                    "type": "MediatedHttpPresentationService2021",
                    "serviceEndpoint": "http://localhost:3000/vc-api/exchanges/{EXCHANGE ID}/27ce6175-bab7-4a1b-84b2-87cf87ad9163"
                }
            ]
        }
    }
}
```

**Expected Response HTTP Status Code**

`202 Accepted`

#### 1.7 [Consent-Requesting portal] Check for notification of submitted presentation

Check the request bucket configured as the callback when configuring the exchange definition.
There should be a notification of a submitted presentation for the authority portal to review.

The authority portal can rely on VC-API's verification of the credential proofs and conformance to the credential query.
The authority portal can then proceed with reviewing the presentation and issuing the "consenter card" credential.

An example of the expected POST body received in the request bucket is:

```json
{
   "transactionId":"1b9995c6-17ed-4ec4-bbef-7b9ee986bc3c",
   "exchangeId":"consenter-card-issuance-82793",
   "vpRequest": {
        "challenge": "57ca126c-acbf-4da4-8f79-447150e93128",
        "query": [
            {
                "type": "DIDAuth",
                "credentialQuery": []
            }
        ],
        "interact": {
            "service": [
                {
                    "type": "MediatedHttpPresentationService2021",
                    "serviceEndpoint": "http://localhost:3000/exchanges/consenter-card-issuance-82793/55fb5bc5-4f5f-40c8-aa8d-f3a1991637fc"
                }
            ]
        }
    },
   "callback": [
      {
        "url": "http://ptsv2.com/t/ebitx-1652373826/post"
      }
   ],
   "presentationSubmission":{
      "vp":{
          "@context": [
              "https://www.w3.org/2018/credentials/v1"
          ],
          "type": "VerifiablePresentation",
          "proof": {
              "type": "Ed25519Signature2018",
              "proofPurpose": "authentication",
              "challenge": "c2e806b4-35ed-409b-bc3a-b849d7c2b204",
              "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
              "created": "2022-04-29T09:25:55.969Z",
              "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..51vek0DLAcdL2DxMRQlOFfFz306Y-EDvqhWYzCInU9UYFT_HQZHW2udSeX2w35Nn-JO4ouhJFeiM8l3e2sEEBQ"
          },
          "holder": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A"
      },
      "verificationResult":{
         "errors":[],
         "checks":[
            "proof"
         ],
         "warnings":[]
      }
   }
}
```

#### 1.8 [Consent-Requesting portal] Create issuer DID
The authority portal needs a DID from which they can issue a credential.
Again, navigate to the `DID Controller create` request under the `did` folder.
Send the request as described below.

**Request URL**

`{VC API base url}/did`

**HTTP Verb**

`POST`

**Request Body**

```json
{
    "method": "key"
}
```

**Sample Expected Response Body**

This should give a response similar to this one, with a different `did`.
Note down the `id` property. This is the authority portals's DID.

```json
{
    "id": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
    "verificationMethod": [
        {
            "id": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "publicKeyJwk": {
                "crv": "Ed25519",
                "x": "Rijl5w3coKZ2CThvbktmoyaUWxii1hwkfC2R2DrPlxE",
                "kty": "OKP",
                "kid": "vIkflusUjN5yuC5d5gr5GPCK3_reiT3SXhYMTMuuRFg"
            }
        }
    ]
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.9 [Consent-Requesting portal] Issue "consenter card" credential

After having created a new DID, the authority portal can then issue a credential to the consenter DID that was previously created.
Navigate to the `Vc Api Controller issue Credential` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/credentials/issue`

**HTTP Verb**

`POST`

**Request Body**

Fill in, in the json below, the consenter DID as the `subject` id and the authority portal DID as the `issuer` from the DIDs that were generated in previous steps.

```json
{
  "credential": {
      "@context":[
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/citizenship/v1"
      ],
      "id":"https://issuer.oidp.uscis.gov/credentials/83627465",
      "type":[
          "VerifiableCredential",
          "PermanentConsenterCard"
      ],
      "issuer":"<FILL AUTHORITY DID>",
      "issuanceDate":"2019-12-03T12:19:52Z",
      "expirationDate":"2029-12-03T12:19:52Z",
      "credentialSubject":{
          "id":"<FILL RESIDENT DID>",
          "type":[
            "PermanentConsenter",
            "Person"
          ],
          "givenName":"JOHN",
          "familyName":"SMITH",
          "gender":"Male",
          "image":"data:image/png;base64,iVBORw0KGgo...kJggg==",
          "consenterSince":"2015-01-01",
          "lprCategory":"C09",
          "lprNumber":"999-999-999",
          "commuterClassification":"C1",
          "birthCountry":"Bahamas",
          "birthDate":"1958-07-17"
      }
    },
    "options": {
    }
}
```

**Sample Expected Response Body**

The resonse is an issued Verifiable Credential, similar to the one shown below.

```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/citizenship/v1"
    ],
    "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
    "type": [
        "VerifiableCredential",
        "PermanentConsenterCard"
    ],
    "credentialSubject": {
        "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
        "gender": "Male",
        "commuterClassification": "C1",
        "birthDate": "1958-07-17",
        "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
        "consenterSince": "2015-01-01",
        "givenName": "JOHN",
        "type": [
            "PermanentConsenter",
            "Person"
        ],
        "lprCategory": "C09",
        "birthCountry": "Bahamas",
        "lprNumber": "999-999-999",
        "familyName": "SMITH"
    },
    "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
    "issuanceDate": "2019-12-03T12:19:52Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
        "created": "2022-04-29T09:53:23.786Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
    },
    "expirationDate": "2029-12-03T12:19:52Z"
}
```

#### 1.10 [Consent-Requesting portal] Wrap the issued VC in a VP

The authority portal should then prove a presentation in order to present the credential to the consenter.
Open the `Vc Api Controller prove Presentation` request under the `vc-api` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/vc-api/presentations/prove`

**HTTP Verb**

`POST`

**Request Body**

Fill the body with json below, replacing the "FILL" values appropriately.

```json
{
    "presentation": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": ["<FILL WITH THE ISSUED CREDENTIAL>"]
    },
    "options": {
        "verificationMethod": "<FILL WITH VERIFICATION METHOD ID OF AUTHORITY PORTAL>"
    }
}
```

For example, the body with the filled values would look like:
```json
{
    "presentation": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentConsenterCard"
                ],
                "credentialSubject": {
                    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                    "gender": "Male",
                    "commuterClassification": "C1",
                    "birthDate": "1958-07-17",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "consenterSince": "2015-01-01",
                    "givenName": "JOHN",
                    "type": [
                        "PermanentConsenter",
                        "Person"
                    ],
                    "lprCategory": "C09",
                    "birthCountry": "Bahamas",
                    "lprNumber": "999-999-999",
                    "familyName": "SMITH"
                },
                "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                    "created": "2022-04-29T09:53:23.786Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
                },
                "expirationDate": "2029-12-03T12:19:52Z"
            }
        ]
    },
    "options": {
        "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL"
    }
}
```

**Sample Expected Response Body**

The response body should return a verifiable presentation similar to this one:
```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1"
    ],
    "type": [
        "VerifiablePresentation"
    ],
    "verifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/citizenship/v1"
            ],
            "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
            "type": [
                "VerifiableCredential",
                "PermanentConsenterCard"
            ],
            "credentialSubject": {
                "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                "commuterClassification": "C1",
                "birthDate": "1958-07-17",
                "lprCategory": "C09",
                "consenterSince": "2015-01-01",
                "gender": "Male",
                "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                "givenName": "JOHN",
                "type": [
                    "PermanentConsenter",
                    "Person"
                ],
                "birthCountry": "Bahamas",
                "lprNumber": "999-999-999",
                "familyName": "SMITH"
            },
            "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "issuanceDate": "2019-12-03T12:19:52Z",
            "proof": {
                "type": "Ed25519Signature2018",
                "proofPurpose": "assertionMethod",
                "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "created": "2022-04-29T09:53:23.786Z",
                "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
            },
            "expirationDate": "2029-12-03T12:19:52Z"
        }
    ],
    "proof": {
        "type": "Ed25519Signature2018",
        "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
        "created": "2022-04-29T10:21:42.824Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..FW8cPUUglFWbq61ve02LD-JmVQNr-TQ03rc3wlFeOccbapR0y5IsoNEMHF3wU54kdG9mAeLzJ5aXH6uUFA0iAA"
    }
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.11 [Consent-Requesting portal] Add a review to the exchange

With a verifiable presentation in hand, the authority portal can add a review to the in-progress exchange.
Open the `Vc Api Controller add Submission Review` request under the `vc-api/exchanges/{exchange id}/{transaction id}` folder.

Send the request as described below.

**Request URL**

Use the same `exchangeId` and `transactionId` as the path variables as in the "Continue Exchange" step.

`{VC API base url}/vc-api/exchanges/{exchange id}/{transaction id}/review`

**HTTP Verb**

`POST`

**Request Body**

Fill the json below appropriately and send as the body:
```json
{
    "result": "approved",
    "vp": "<COPY VP FROM PREVIOUS STEP HERE>"
}
```

```json
{
    "result": "approved",
    "vp": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentConsenterCard"
                ],
                "credentialSubject": {
                    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                    "commuterClassification": "C1",
                    "birthDate": "1958-07-17",
                    "lprCategory": "C09",
                    "consenterSince": "2015-01-01",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "givenName": "JOHN",
                    "type": [
                        "PermanentConsenter",
                        "Person"
                    ],
                    "birthCountry": "Bahamas",
                    "lprNumber": "999-999-999",
                    "familyName": "SMITH"
                },
                "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                    "created": "2022-04-29T09:53:23.786Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
                },
                "expirationDate": "2029-12-03T12:19:52Z"
            }
        ],
        "proof": {
            "type": "Ed25519Signature2018",
            "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "created": "2022-04-29T10:21:42.824Z",
            "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..FW8cPUUglFWbq61ve02LD-JmVQNr-TQ03rc3wlFeOccbapR0y5IsoNEMHF3wU54kdG9mAeLzJ5aXH6uUFA0iAA"
        }
    }
}
```

**Sample Expected Response Body**

```json
{
    "errors": []
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 1.12 [Consenter] Continue the exchange and obtain the credentials

As the review is submitted, the consenter can continue the exchange to receive the credential.

To do this, return to the `Vc Api Controller continue Exchange` request in the `vc-api/exchanges/{exchange id}/{transaction id}` folder.
Resend the request.
The response should be similar to the following, where the `vp` contains the issued credential.

```json
{
    "errors": [],
    "vp": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentConsenterCard"
                ],
                "credentialSubject": {
                    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                    "commuterClassification": "C1",
                    "birthDate": "1958-07-17",
                    "lprCategory": "C09",
                    "consenterSince": "2015-01-01",
                    "gender": "Male",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "givenName": "JOHN",
                    "type": [
                        "PermanentConsenter",
                        "Person"
                    ],
                    "birthCountry": "Bahamas",
                    "lprNumber": "999-999-999",
                    "familyName": "SMITH"
                },
                "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                    "created": "2022-04-29T09:53:23.786Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
                },
                "expirationDate": "2029-12-03T12:19:52Z"
            }
        ],
        "proof": {
            "type": "Ed25519Signature2018",
            "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "created": "2022-04-29T10:21:42.824Z",
            "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..FW8cPUUglFWbq61ve02LD-JmVQNr-TQ03rc3wlFeOccbapR0y5IsoNEMHF3wU54kdG9mAeLzJ5aXH6uUFA0iAA"
        }
    }
}
```

### 2. Permanent Consenter Card verification

#### 2.1 [Verifier] Configure Credential Exchange

The Verifier needs to configure the parameters of the credential exchange by sending an [Exchange Definition](../exchanges.md#exchange-definitions).
To do this, navigate to the `Vc Api Controller create Exchange` under `vc-api/exchanges` and send with the json below.

Send the request as described below.

**Request URL**

`{VC API base url}/vc-api/exchanges`

**HTTP Verb**

`POST`

**Request Body**

Fill `exchangeId` in the json below.
`exchangeId` should be an id unique to this exchange, for example a UUID.

The exchange definition in the example below uses an exchange definition with two
 input descriptors in the [Presentation Definition](https://identity.foundation/presentation-exchange in order to request two credentials:
1.  
Note the constraint on the `$.type` path of the credential.
This is used to require that the presented credential be of type "PermanentConsenterCard".
For more information on credential constraints, see the [Presentation Exchange specification](https://identity.foundation/presentation-exchange).

```json
{
   "exchangeId":"<SOME UNIQUE ID>",
   "query":[
      {
         "type":"PresentationDefinition",
         "credentialQuery":[
            {
               "presentationDefinition":{
                    "id":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
                    "input_descriptors":[
                        {
                          "id":"permanent_consenter_card",
                          "name":"Permanent Consenter Card",
                          "constraints": {
                            "fields":[
                              {
                                "path":[
                                  "$.type"
                                ],
                                "filter":{
                                  "type":"array",
                                  "contains":{
                                    "type":"string",
                                    "const":"PermanentConsenterCard"
                                  }
                                }
                              }
                            ]
                          }
                        },
                        {
                          "id": "consent_agreement",
                          "name": "Consent Agreement",
                          "constraints": {
                            "subject_is_issuer":"required",
                            "fields":[
                                {
                                  "path":"$.@context",
                                  "filter":{
                                      "$schema":"http://json-schema.org/draft-07/schema#",
                                      "type":"array",
                                      "items":[
                                        {
                                            "const":"https://www.w3.org/2018/credentials/v1"
                                        },
                                        {
                                            "$ref":"#/definitions/eliaGroupContext"
                                        }
                                      ],
                                      "additionalItems":false,
                                      "minItems":2,
                                      "maxItems":2,
                                      "definitions":{
                                        "eliaGroupContext":{
                                            "type":"object",
                                            "properties":{
                                              "elia":{
                                                  "const":"https://www.eliagroup.eu/ld-context-2022#"
                                              },
                                              "consent":{
                                                  "const":"elia:consent"
                                              }
                                            },
                                            "additionalProperties":false,
                                            "required":[
                                              "elia",
                                              "consent"
                                            ]
                                        }
                                      }
                                  }
                                },
                                {
                                  "path":"$.credentialSubject",
                                  "filter":{
                                      "type":"object",
                                      "properties":{
                                        "consent":{
                                            "const":"I consent to such and such"
                                        }
                                      },
                                      "additionalProperties":false
                                  }
                                  },
                                  {
                                    "path":"$.type",
                                    "filter":{
                                        "type":"array",
                                        "items":[
                                          {
                                              "const":"VerifiableCredential"
                                          }
                                        ]
                                    }
                                  }
                              ]
                          }
                        }
                    ]
                }
            }
         ]
      }
   ],
   "interactServices":[
      {
         "type":"UnmediatedHttpPresentationService2021"
      }
   ],
   "isOneTime":true,
   "callback":[]
}
```

**Sample Expected Response Body**

```json
{
    "errors": []
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 2.2 [Verifier] Provide an exchange invitation to the consenter

Having configured the exchange, the Verifier must then ask the consenter to present the required credentials.

```json
{
  "outOfBandInvitation": {
    "type": "https://example.com/out-of-band/vc-api-exchange",
    "body": {
      "url": "http://localhost:3000/vc-api/exchanges/<FILL WITH YOUR EXCHANGE ID>"
    }
  }
}
```

#### 2.3 [Consenter] Initiate the presentation exchange

Initiate the credential exchange by POSTing to the `url` directly in Postman or by navigating to the `Vc Api Controller initiate Exchange` request in the collection.
Send the request as described below.

**Request URL**

If using the Postman collection request, fill in the `exchangeId` param to be the value used for the exchange Id by the Verifier.
`{VC API base url}/vc-api/exchanges/{exchange id}`

**HTTP Verb**

`POST`

**Request Body**

*empty*

**Sample Expected Response Body**

A similar json should be returned in the response body:
```json
{
   "errors":[
      
   ],
   "vpRequest":{
      "challenge":"7c66d573-4da6-4e13-b52f-9b5c844d6d52",
      "query":[
         {
            "type":"PresentationDefinition",
            "credentialQuery":[
               {
                  "presentationDefinition":{
                     "id":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
                     "input_descriptors":[
                        {
                           "id":"PermanentConsenterCard",
                           "name":"Permanent Consenter Card",
                           "constraints":{
                              "fields":[
                                 {
                                    "path":[
                                       "$.type"
                                    ],
                                    "filter":{
                                       "type":"array",
                                       "contains":{
                                          "type":"string",
                                          "const":"PermanentConsenterCard"
                                       }
                                    }
                                 }
                              ]
                           }
                        },
                        {
                          "id": "consent_agreement",
                          "name": "Consent Agreement",
                          "constraints": {
                            "subject_is_issuer":"required",
                            "fields":[
                                {
                                  "path":"$.@context",
                                  "filter":{
                                      "$schema":"http://json-schema.org/draft-07/schema#",
                                      "type":"array",
                                      "items":[
                                        {
                                            "const":"https://www.w3.org/2018/credentials/v1"
                                        },
                                        {
                                            "$ref":"#/definitions/eliaGroupContext"
                                        }
                                      ],
                                      "additionalItems":false,
                                      "minItems":2,
                                      "maxItems":2,
                                      "definitions":{
                                        "eliaGroupContext":{
                                            "type":"object",
                                            "properties":{
                                              "elia":{
                                                  "const":"https://www.eliagroup.eu/ld-context-2022#"
                                              },
                                              "consent":{
                                                  "const":"elia:consent"
                                              }
                                            },
                                            "additionalProperties":false,
                                            "required":[
                                              "elia",
                                              "consent"
                                            ]
                                        }
                                      }
                                  }
                                },
                                {
                                  "path":"$.credentialSubject",
                                  "filter":{
                                      "type":"object",
                                      "properties":{
                                        "consent":{
                                            "const":"I consent to such and such"
                                        }
                                      },
                                      "additionalProperties":false
                                  }
                                  },
                                  {
                                    "path":"$.type",
                                    "filter":{
                                        "type":"array",
                                        "items":[
                                          {
                                              "const":"VerifiableCredential"
                                          }
                                        ]
                                    }
                                  }
                              ]
                          }
                        }
                     ]
                  }
               }
            ]
         }
      ],
      "interact":{
         "service":[
            {
               "type":"UnmediatedHttpPresentationService2021",
               "serviceEndpoint":"https://vc-api-dev.energyweb.org/vc-api/exchanges/34712646/b38b7c65-f0d7-4d00-b026-f2704ff716cc"
            }
         ]
      }
   },
   "processingInProgress":false
}
```
The `challenge` value and the final fragment of the `serviceEndpoint`, which is the `transaction id`, should be different.

The response contains a VP Request, which is a specification defined here: https://w3c-ccg.github.io/vp-request-spec/.
You can see that the VP Request's `query` section contains a `PresentationDefinition` query.
This means that the holder must provide credentials which satisfy the `presentationDefinition`.

Also note the `service` in the `interact` section of the VP Request.
This is providing the location at which we can continue the credential request flow once we have met the `query` requirements.

**Expected Response HTTP Status Code**

`201 Created`
      
#### 2.4 [Consenter] Create the required presentation

Open the `Vc Api Controller prove Presentation` request under the `vc-api/presentations/prove` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/vc-api/presentations/prove`

**HTTP Verb**

`POST`

**Request Body**

In the request body, use the following json, filled with your own values.
The `challenge` should be value received from the VP Request in the previous step.

```json
{
    "presentation": {
        "@context":[
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type":[
            "VerifiablePresentation"
        ],
        "verifiableCredential":[
            "<FILL WITH VC RECEIVED FROM AUTHORITY>"
        ],
        "holder": "<FILL WITH RESIDENT DID>"
    },
    "options": {
        "verificationMethod": "<FILL WITH RESIDENT DID VERIFICATION METHOD",
        "proofPurpose": "authentication",
        "challenge": "<FILL WITH CHALLENGE FROM VP REQUEST>"
    }
}
```

For example, your filled json would look like:

```json
{
    "presentation": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentConsenterCard"
                ],
                "credentialSubject": {
                    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                    "gender": "Male",
                    "commuterClassification": "C1",
                    "birthDate": "1958-07-17",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "consenterSince": "2015-01-01",
                    "givenName": "JOHN",
                    "type": [
                        "PermanentConsenter",
                        "Person"
                    ],
                    "lprCategory": "C09",
                    "birthCountry": "Bahamas",
                    "lprNumber": "999-999-999",
                    "familyName": "SMITH"
                },
                "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                    "created": "2022-04-29T09:53:23.786Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
                },
                "expirationDate": "2029-12-03T12:19:52Z"
            }
        ],
        "holder": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A"
    },
    "options": {
        "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
        "proofPurpose": "authentication",
        "challenge": "7c66d573-4da6-4e13-b52f-9b5c844d6d52"
    }
}
```

**Sample Expected Response Body**

The response should be a verifiable presentation, similar to the one below.
```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": [
        "VerifiablePresentation"
    ],
    "verifiableCredential": [
        {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/citizenship/v1"
            ],
            "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
            "type": [
                "VerifiableCredential",
                "PermanentConsenterCard"
            ],
            "credentialSubject": {
                "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                "birthDate": "1958-07-17",
                "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                "lprCategory": "C09",
                "commuterClassification": "C1",
                "birthCountry": "Bahamas",
                "lprNumber": "999-999-999",
                "consenterSince": "2015-01-01",
                "type": [
                    "PermanentConsenter",
                    "Person"
                ],
                "gender": "Male",
                "familyName": "SMITH",
                "givenName": "JOHN"
            },
            "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
            "issuanceDate": "2019-12-03T12:19:52Z",
            "proof": {
                "type": "Ed25519Signature2018",
                "proofPurpose": "assertionMethod",
                "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "created": "2022-04-29T09:53:23.786Z",
                "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
            },
            "expirationDate": "2029-12-03T12:19:52Z"
        }
    ],
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "authentication",
        "challenge": "7c66d573-4da6-4e13-b52f-9b5c844d6d52",
        "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
        "created": "2022-04-29T10:56:09.336Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..Sqpo8ostkoK7_69TxvHMzzRLuebdZ8IaXj2z6p1-M30FSZdIXMPXBg4kyukoKZ4Jls7eXyJ0FgaSKirGO-reCA"
    },
    "holder": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A"
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 2.5 [Consenter] Continue the exchange

Continue the exchange by sending the VP in response to the VP Request that was previously received.
Open the `Vc Api Controller continue Exchange` request in the `vc-api/exchanges/{exchange Id}` folder.

Send the request as described below.

**Request URL**

In the request params, use the `transactionId` and `exchangeId` from the `serviceEndpoint` in the VP Request.

`{VC API base url}/vc-api/exchanges/{exchangeId}/{transactionId}`

**HTTP Verb**

`PUT`

**Request Body**

In the request body, copy the VP that was obtained from the previous step.

**Sample Expected Response Body**

```json
{
    "errors": []
}
```

**Expected Response HTTP Status Code**

`200 OK`

#### 2.6 [Verifier] Act on Submitted Presentation

In this presentation exchange (part 2) of this tutorial, no callback was configured in the exchange definition.
This is because the Post Test Server (used [during the issuance exchange](#11-authority-portal-configure-the-credential-issuance-exchange)) has a Body Length of 1500 and so cannot accept the POST.
However, typically a Verifier would configure a callback in order to be able to act on the submitted presentation.

For reference, the callback notification that would have been receive in a configured callback for this presentation would be:

```json
{
   "transactionId":"b38b7c65-f0d7-4d00-b026-f2704ff716cc",
   "exchangeId":"34712646",
   "vpRequest":{
      "challenge":"7c66d573-4da6-4e13-b52f-9b5c844d6d52",
      "query":[
         {
            "type":"PresentationDefinition",
            "credentialQuery":[
               {
                  "presentationDefinition":{
                     "id":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
                     "input_descriptors":[
                        {
                           "id":"PermanentConsenterCard",
                           "name":"PermanentConsenterCard",
                           "purpose":"PermanentConsenterCard",
                           "constraints":{
                              "fields":[
                                 {
                                    "path":[
                                       "$.type"
                                    ],
                                    "filter":{
                                       "type":"array",
                                       "contains":{
                                          "type":"string",
                                          "const":"PermanentConsenterCard"
                                       }
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }
      ],
      "interact":{
         "service":[
            {
               "type":"UnmediatedHttpPresentationService2021",
               "serviceEndpoint":"https://vc-api-dev.energyweb.org/vc-api/exchanges/34712646/b38b7c65-f0d7-4d00-b026-f2704ff716cc"
            }
         ]
      }
   },
   "presentationSubmission":{
      "vp":{
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type": [
            "VerifiablePresentation"
        ],
        "verifiableCredential": [
            {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://w3id.org/citizenship/v1"
                ],
                "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
                "type": [
                    "VerifiableCredential",
                    "PermanentConsenterCard"
                ],
                "credentialSubject": {
                    "id": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
                    "birthDate": "1958-07-17",
                    "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
                    "lprCategory": "C09",
                    "commuterClassification": "C1",
                    "birthCountry": "Bahamas",
                    "lprNumber": "999-999-999",
                    "consenterSince": "2015-01-01",
                    "type": [
                        "PermanentConsenter",
                        "Person"
                    ],
                    "gender": "Male",
                    "familyName": "SMITH",
                    "givenName": "JOHN"
                },
                "issuer": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                "issuanceDate": "2019-12-03T12:19:52Z",
                "proof": {
                    "type": "Ed25519Signature2018",
                    "proofPurpose": "assertionMethod",
                    "verificationMethod": "did:key:z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL#z6MkjB8kjJee3JoJ9WmzTG2vXhWJ9KtwPtWLtEec17iFNiEL",
                    "created": "2022-04-29T09:53:23.786Z",
                    "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..slzsK4BoLyMHX18MtnVlwF9JqKj4BvVC46cjyVBPFPwrjpzGhbLLbAV3x_j-_B4ZUZuQBa5a-yq6CiW6sJ26AA"
                },
                "expirationDate": "2029-12-03T12:19:52Z"
            }
        ],
        "proof": {
            "type": "Ed25519Signature2018",
            "proofPurpose": "authentication",
            "challenge": "7c66d573-4da6-4e13-b52f-9b5c844d6d52",
            "verificationMethod": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A#z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A",
            "created": "2022-04-29T10:56:09.336Z",
            "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..Sqpo8ostkoK7_69TxvHMzzRLuebdZ8IaXj2z6p1-M30FSZdIXMPXBg4kyukoKZ4Jls7eXyJ0FgaSKirGO-reCA"
        },
        "holder": "did:key:z6MkvWkza1fMBWhKnYE3CgMgxHem62YkEw4JbdmEZeFTEZ7A"
      },
      "verificationResult":{
         "errors":[
            
         ],
         "checks":[
            "proof"
         ],
         "warnings":[
            
         ]
      }
   }
}
```