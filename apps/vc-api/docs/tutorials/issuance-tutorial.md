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

# Tutorial

## Business overview
The business objective of this tutorial is to demonstrate how to issue a Verifiable Credential (VC) to a known user connected to a portal that we will call "authority portal".
In the example below, we will issue a permanent residency card to a user we will call "resident". We use the context "https://w3id.org/residentship/v1" which describes the data of a VC of type "PermanentResidentCard".

Here is an extract of the context:

        ...
        "id": "@id",
        "type": "@type",

        "ctzn": "https://w3id.org/residentship#",
        "schema": "http://schema.org/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "birthCountry": "ctzn:birthCountry",
        "birthDate": {"@id": "schema:birthDate", "@type": "xsd:dateTime"},
        "commuterClassification": "ctzn:commuterClassification",
        "familyName": "schema:familyName",
        "gender": "schema:gender",
        "givenName": "schema:givenName",
        "lprCategory": "ctzn:lprCategory",
        "lprNumber": "ctzn:lprNumber",
        "residentSince": {"@id": "ctzn:residentSince", "@type": "xsd:dateTime"}
        ...

To get the definition of the field "gender" which points to the definition "schema:gender", use the URI of "schema" which points to "http://schema.org/", so we will have a definition available at "http://schema.org/gender".
Regarding the aliasing of `id` to `@id` and `type` to `@type`, see the [VC specification](https://www.w3.org/TR/vc-data-model/#syntactic-sugar).

We therefore assume that the resident is connected to the autority portal and that the information contained in the context about the resident is available in the autority portal database.

### Business workflows

#### Issuance Business workflow
1. The authority portal authenticates the current user as a known resident.
1. The resident requests a "PermanentResidentCard" credential on the autority portal and provides a DID of their choosing.
1. The authority portal issues a "PermanentResidentCard" containing the resident's information to that DID and displays a QR code allowing the resident's wallet to receive the credential.
1. The resident's scans the QR code with their mobile wallet. The wallet then contacts the autority portal again to receive the "PermanentResidentCard" credential.

#### Presentation Business workflow
1. The authority portal displays a QR code requesting a presentation containing the "PermanentResidentCard" credential
1. The resident scans the QR code with their mobile wallet and prompts the user for permission to present the "PermanentResidentCard" credential
1. The resident confirms and the presentation is submitted to the authority portal who can then authorize the resident

## Technical overview
From a technical point of view, in this tutorial, we have access to the server API but no mobile wallet is available. So we will use the server API for both roles of the portal and the resident's mobile wallet.

We will follow the following steps in this tutorial, covering both credential issuance and presentation:
- [Resident action] Create a DID for the resident using the "did:key" DID method
- [Authority portal action] Create a DID for the authority portal using the "did:key" DID method
- [Authority portal action] Issue a "PermanentResidentCard" credential to the resident's DID
- [Authority portal action] Configure a credential exchange which requests the "PermanentResidentCard" credential 
- [Authority portal action] Transmit an exchange invitation to the resident as a QR code or a deep link
- [Resident action] Initiate the exchange and obtain a [Verifiable Presentation Request](https://w3c-ccg.github.io/vp-request-spec/) in return
- [Resident action] Create a Verifiable Presentation which contains the "PermanentResidentCard" credential 
- [Resident action] Send the Verifiable Presentation to the authority portal

## Overview and Objective

The objective of this tutorial is walk through a simple credential issuance and presentation flow.
A diagram of this flow is available in the root README.

## Steps
### Setup the Postman Collection

First, download and install [Postman](https://www.postman.com/downloads/).

Then, from the Postman app, import [the open-api json](./open-api.json) and [the environment](./ewf-ssi-wallet.postman_environment.json) for the Nest.js wallet. Instructions on how to import into Postman can be found [here](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

### Permanent Resident Card issuance

#### [Resident] Create DID

The resident needs a DID to which the authority portal can issue a credential.
This DID will be the Subject identifier of our credential.

Navigate to the `DID Controller create` request under the `did` folder.
Ensure the request body is as shown and send.
```json
{
    "method": "key"
}
```
This should give a response similar to this one, with a different `did`.
Note down the `id` property. This is the resident's DID.
```json
{
    "id": "did:key:z6Mkpie6MAfQgBkR7jbna6Co1pnFy2JzEuUcZCxgr5PaLm36",
    "verificationMethod": [
        {
            "id": "did:key:z6Mkpie6MAfQgBkR7jbna6Co1pnFy2JzEuUcZCxgr5PaLm36#z6Mkpie6MAfQgBkR7jbna6Co1pnFy2JzEuUcZCxgr5PaLm36",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6Mkpie6MAfQgBkR7jbna6Co1pnFy2JzEuUcZCxgr5PaLm36",
            "publicKeyJwk": {
                "crv": "Ed25519",
                "x": "mIWCuLzyKtIlmqImS-ilDJ5A_HP6dwfe9qYHaE-KUvE",
                "kty": "OKP",
                "kid": "1a0KJFn9Ftc2rRQ5T_0YzEYFrVugfZ0e4sV6y8Z3Rg8"
            }
        }
    ]
}
```

#### [Authority portal] Issue "resident contract" credential

First, the authority portal needs a DID from which they can issue a credential.
Again, navigate to the `DID Controller create` request under the `did` folder.
Ensure the request body is as shown and send.
```json
{
    "method": "key"
}
```

Again, this should give a response similar to this one, with a different `did`.
Note down the `id` property. This is the authority portals's DID.

```json
{
    "id": "did:key:z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d",
    "verificationMethod": [
        {
            "id": "did:key:z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d#z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d",
            "publicKeyJwk": {
                "crv": "Ed25519",
                "x": "0ezbuPe2ng7ZfY9ebAS-6ys9q866VzCJG1OTzp1vbJQ",
                "kty": "OKP",
                "kid": "qKXGNB3pP2T117ZwsEOhe_F5OkSr6qSVqGe4tVGly9A"
            }
        }
    ]
}
```

After having created a new DID, the authority portal can then issue a credential to the resident DID that was previously created.
The authority portal may want to confirm that the resident in question controls the DID first, however this step is currently omitted.

Navigate to the `Vc Api Controller issue Credential` request under the `vc-api` folder.
Fill in, in the JSON below, the customer DID as the `subject` id, the authority portal DID as the `issuer` id and the `verificationMethod.id` from the DID document of the authority portal as the `options.verificationMethod` from the DIDs that were generated in previous steps.

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
          "PermanentResidentCard"
      ],
      "issuer":"<FILL AUTHORITY DID>",
      "issuanceDate":"2019-12-03T12:19:52Z",
      "expirationDate":"2029-12-03T12:19:52Z",
      "credentialSubject":{
          "id":"<FILL RESIDENT DID>",
          "type":[
            "PermanentResident",
            "Person"
          ],
          "givenName":"JOHN",
          "familyName":"SMITH",
          "gender":"Male",
          "image":"data:image/png;base64,iVBORw0KGgo...kJggg==",
          "residentSince":"2015-01-01",
          "lprCategory":"C09",
          "lprNumber":"999-999-999",
          "commuterClassification":"C1",
          "birthCountry":"Bahamas",
          "birthDate":"1958-07-17"
      }
    },
    "options": {
        "verificationMethod": "<FILL AUTHORITY VERIFICATION METHOD>",
        "proofPurpose": "assertionMethod"
    }
}
```

Once the DIDs are filled in, send the request.
The response should have a `201` code and have a body similar to the json below.

```json
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/citizenship/v1"
    ],
    "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
    "type": [
        "VerifiableCredential",
        "PermanentResidentCard"
    ],
    "credentialSubject": {
        "id": "did:key:z6Mkpie6MAfQgBkR7jbna6Co1pnFy2JzEuUcZCxgr5PaLm36",
        "givenName": "JOHN",
        "image": "data:image/png;base64,iVBORw0KGgo...kJggg==",
        "birthDate": "1958-07-17",
        "birthCountry": "Bahamas",
        "familyName": "SMITH",
        "lprNumber": "999-999-999",
        "gender": "Male",
        "residentSince": "2015-01-01",
        "type": [
            "PermanentResident",
            "Person"
        ],
        "lprCategory": "C09",
        "commuterClassification": "C1"
    },
    "issuer": "did:key:z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d",
    "issuanceDate": "2019-12-03T12:19:52Z",
    "proof": {
        "type": "Ed25519Signature2018",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:key:z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d#z6MktaijU1pi636ixvbYyZSrHN8rJpTXif4EFifD2oGMhT5d",
        "created": "2022-04-19T20:59:22.020Z",
        "jws": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..wLkX00RFWH_bC-1Xgf_6aWFlbTSsbiQZcn94gPV2cDejocflLqybitUzM7HenxqoW6S6nhrC0AN5CYplBXEhCw"
    },
    "expirationDate": "2029-12-03T12:19:52Z"
}
```