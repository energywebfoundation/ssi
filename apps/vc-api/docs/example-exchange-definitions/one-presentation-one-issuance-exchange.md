Sample Exchange Definition for an issuance and presentation.

Use case:

1. Holder needs to prove control over DID to obtain a Verifiable Credential from authority, thus exchange definition of type `DIDAuth` is needed.

`DIDAuth` exchange-definition :

```json
{
    "exchangeId": "286bc1e0-f1bd-488a-a873-8d71be3c690e",
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
        "url": "https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a"
      }
    ],
    "isOneTime":true
}
```