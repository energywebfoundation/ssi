Sample Exchange Definition for a presentation and issuance - Holder needs to prove control over DID, thus exchange definition of type DIDAuth is needed to get the Credential from Issuer and another exchange definition to present the credential.

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

`PresentationDefinition` exchange Definition.

``` json
{
   "exchangeId":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
   "query":[
      {
         "type":"PresentationDefinition",
         "credentialQuery":[
            {
               "presentationDefinition":{
                    "id":"286bc1e0-f1bd-488a-a873-8d71be3c690e",
                    "input_descriptors":[
                        {
                          "id":"permanent_resident_card",
                          "name":"Permanent Resident Card",
                          "purpose":"We can only allow permanent residents into the application",
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
                                    "const":"PermanentResidentCard"
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
   "interactServices":[
      {
         "type":"UnmediatedHttpPresentationService2021"
      }
   ],
   "isOneTime":true,
   "callback":[
     {
       "url": "https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a"
     }
   ]
}
```