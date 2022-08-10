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
TODO. See [business workflows from resident-card tutorial](./resident-card-tutorial.md#business-workflows)

## Technical overview
From a technical point of view, in this tutorial, we have access to the server API but no mobile wallet is available. So we will use the server API for both roles of the portal and the consent providers's mobile wallet.

### Technical workflows

The technical workflow is as follows:
*TODO* fill in steps once written

## Steps
### 0. Setup the Postman Collection

First, download and install [Postman](https://www.postman.com/downloads/).

Then, from the Postman app, import the following API definitions:
- [VC-API open-api json](../openapi.json)
- [Input-descriptor-to-credential](../../../credential-from-input-descriptor/docs/openapi.json)

Then, import [the environment](../vc-api.postman_environment.json) for VC-API.

Instructions on how to import into Postman can be found [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

### 1 [Consent-Requesting portal] Configure the consent request exchange

The consent-requesting portal needs to configure the parameters of the consent exchange by sending an [Exchange Definition](../exchanges.md#exchange-definitions).
To do this, navigate to the `Vc Api Controller create Exchange` under `vc-api/exchanges` and send the request described below.

**Request URL**

`{VC API base url}/v1/vc-api/exchanges`

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
         "type":"PresentationDefinition",
         "credentialQuery":[
            {
               "presentationDefinition":{
                    "id":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
                    "input_descriptors":[
                        {
                          "id": "consent_agreement",
                          "name": "Consent Agreement",
                          "constraints": {
                            "subject_is_issuer":"required",
                            "fields":[
                                {
                                  "path":["$.@context"],
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
                                  "path":["$.credentialSubject"],
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
                                    "path":["$.type"],
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
    "interactServices": [
      {
        "type": "UnmediatedHttpPresentationService2021"
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

#### 2 [Consent-Requesting portal] Provide an exchange invitation to the consenter

The consent-requesting portal can communicate to the consenter that they can initiate request for a "PermanentConsenterCard" credential by
filling the `exchange id` in the json template below and transmitting the json to the consenter.
They can do this transmission by encoding the json in a QR code and displaying to the consenter for example.

```json
{
    "outOfBandInvitation": { 
        "type": "https://energyweb.org/out-of-band-invitation/vc-api-exchange",
        "body": { 
            "url": "http://localhost:3000/vc-api/exchanges/{THE EXCHANGE ID FROM THE PREVIOUS STEP}" 
        }
    }
} 
```

#### 3 [Consenter] Initiate issuance exchange using the request URL

Initiate a request for a PermanentConsenterCard by POSTing to the `url` directly in Postman or by navigating to the `Vc Api Controller initiate Exchange` request in the collection.

Send the request as described below.

**Request URL**

If using the collection request, fill in the `exchangeid` param to be the exchange ID used in the first step.
`{VC API base url}/v1/vc-api/exchanges/{exchangeId}`

**HTTP Verb**

`POST`

**Request Body**

*empty*

**Sample Expected Response Body**

The response contains a VP Request, which is a specification defined here: https://w3c-ccg.github.io/vp-request-spec/.
You can see that the VP Request's `query` section contains a `PresentationDefinition` `credentialQuery`.
This presentation definition requests a self-signed credential (via the `subject_is_issuer` property).

The `challenge` value and the final fragment of the `serviceEndpoint`, which is the `transaction id`, should be different from the sample below.

Also note the `service` in the `interact` section of the VP Request.
This is providing the location at which we can continue the credential exchange once we have met the `query` requirements.

```json
{
    "errors": [],
    "vpRequest": {
        "challenge": "360bd8e5-2778-4a99-98d8-b646df9f0f9b",
        "query": [
            {
                "type": "PresentationDefinition",
                "credentialQuery": [
                    {
                        "presentationDefinition": {
                            "id": "286bc1e0-f1bd-488a-a873-8d71be3c690e",
                            "input_descriptors": [
                                {
                                    "id": "consent_agreement",
                                    "name": "Consent Agreement",
                                    "constraints": {
                                        "subject_is_issuer": "required",
                                        "fields": [
                                            {
                                                "path": [
                                                    "$.type"
                                                ],
                                                "filter": {
                                                    "type": "array",
                                                    "items": [
                                                        {
                                                            "const": "VerifiableCredential"
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
        "interact": {
            "service": [
                {
                    "type": "UnmediatedHttpPresentationService2021",
                    "serviceEndpoint": "https://vc-api-dev.energyweb.org/v1/vc-api/exchanges/consent-exchange-1/80462c03-a310-4c4b-a3af-ffba0d499ffc"
                }
            ]
        }
    },
    "processingInProgress": false
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 4 [Consenter] Create a DID

Let's create a new DID for which the consenter can prove control.
This DID will be the Subject identifier of the Consenter Card credential.

Navigate to the `DID Controller create` request under the `did` folder.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/did`

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
    "id": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
    "verificationMethod": [
        {
            "id": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg#z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
            "publicKeyJwk": {
                "kty": "OKP",
                "crv": "Ed25519",
                "x": "dBOy77jOc7Q94IFTxdadAGCeHUv_9TTjHOyhdOEu9oM",
                "kid": "Dwzx58ChKo-M2MoCvKjIY5R_h4esOJZvTEi7QVUPfuc"
            }
        }
    ]
}
```

**Expected Response HTTP Status Code**

`201 Created`

#### 5 [Consenter] Convert the input descriptor to a credential

In order to fulfil the consent request, the consenter can issue themselves a credential.
However, the consent request is given as a JSON Schema which describes a credential, not a credential itself.
The [Credential from Input Descriptor service](../../../credential-from-input-descriptor/) can be used to convert an input descriptor to a credential which can then be self-signed.

This can be done by providing the `constraints` object from the input descriptor received when initiating the exchange.

Open the `Converter Controller input Descriptor To Credential` request in the "Input Descriptor to Credential" collection.
**Change `{{baseUrl}}` to `{{idcUrl}}` in the request URL**, so that it matches the Postman environment.

Send the request as described below.

**Request URL**

`{Input-Descriptor-To-Credential base url}/converter/input-descriptor-to-credential`

**HTTP Verb**

`POST`

**Request Body**

```json
{
   "constraints":{
      "subject_is_issuer":"required",
      "fields":[
         {
            "path":[
               "$.@context"
            ],
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
            "path":[
               "$.credentialSubject"
            ],
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
            "path":[
               "$.type"
            ],
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
```

**Sample Expected Response Body**

```json
{
    "credential": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            {
                "elia": "https://www.eliagroup.eu/ld-context-2022#",
                "consent": "elia:consent"
            }
        ],
        "credentialSubject": {
            "consent": "I consent to such and such"
        },
        "type": [
            "VerifiableCredential"
        ]
    }
}
```
#### 6 [Consenter] Issue a self-signed credential

The consenter can now sign the credential to create a self-signed verifiable credential.
The consenter should add the following fields to the credential receive in the previous step:
- `issuer`
- `issuanceDate`

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/credentials/issue`

**HTTP Verb**

`POST`

**Request Body**

```json
{
    "credential": {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            {
                "elia": "https://www.eliagroup.eu/ld-context-2022#",
                "consent": "elia:consent"
            }
        ],
        "credentialSubject": {
            "consent": "I consent to such and such"
        },
        "type": [
            "VerifiableCredential"
        ],
        "issuer": "did:key:z6MkrWiBRWRndUfwJnX9REiH9QHVY7NJRyWvfreMFdL42RwQ",
        "issuanceDate":"2022-10-03T12:19:52Z"
    },
    "options": {}
}
```

**Sample Expected Response Body**

```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
            "consent": "elia:consent",
            "elia": "https://www.eliagroup.eu/ld-context-2022#"
        }
    ],
    "type": [
        "VerifiableCredential"
    ],
    "credentialSubject": {
        "consent": "I consent to such and such"
    },
    "issuer": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
    "issuanceDate": "2019-12-03T12:19:52Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg#z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
        "created": "2022-08-09T12:11:28.018Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..IoCSSOIWVOrQYTan75wn7oZBZF_5m7Ka76BaaLkAIZQiQZRDfzPcOkPw3O2fT_FZV-e0KHHnsoI8Qp0gdtHTCw"
    }
}
```

#### 6 [Consenter] Create a presentation with the self-signed credential

The consenter can now create a verifiable presentation for submission.

Send the request as described below.

**Request URL**

`{VC API base url}/v1/vc-api/credentials/issue`

**HTTP Verb**

`POST`

**Request Body**

In the request body, use the following json, filled with your own values.
The `challenge` should be value received from the VP Request obtained when initiating the exchange.

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
            "<FILL WITH VC ISSUED IN PREVIOUS STEP>"
        ],
        "holder": "<FILL WITH CONSENTER DID>"
    },
    "options": {
        "verificationMethod": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg#z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
        "proofPurpose": "authentication",
        "challenge": "<FILL WITH CHALLENGE FROM VP REQUEST>"
    }
}
```

**Sample Expected Response Body**

```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        {
            "consent": "elia:consent",
            "elia": "https://www.eliagroup.eu/ld-context-2022#"
        }
    ],
    "type": [
        "VerifiableCredential"
    ],
    "credentialSubject": {
        "consent": "I consent to such and such"
    },
    "issuer": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
    "issuanceDate": "2019-12-03T12:19:52Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:key:z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg#z6MknGNm3sAwYNesSZ8MXmdJKkUr3L2rC7hbU1sr1c65XEDg",
        "created": "2022-08-09T12:11:28.018Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..IoCSSOIWVOrQYTan75wn7oZBZF_5m7Ka76BaaLkAIZQiQZRDfzPcOkPw3O2fT_FZV-e0KHHnsoI8Qp0gdtHTCw"
    }
}
```