Sample Exchange Definition for a self-signed and issuance - Holder needs to prove control over DID, thus exchange definition of type DIDAuth is needed to get the Credential from Issuer and another exchange definition to present the obtained credential and self-signed credentials.

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
                  "submission_requirements":[
                     {
                        "name":"Consent and Resident-card Exchange",
                        "rule":"pick",
                        "min":2,
                        "from":"A"
                     }
                  ],
                  "input_descriptors":[
                     {
                        "id":"PermanentResidentCard",
                        "name":"PermanentResidentCard",
                        "purpose":"PermanentResidentCard",
                        "group":[
                           "A"
                        ],
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
                                       "const":"PermanentResidentCard"
                                    }
                                 }
                              }
                           ]
                        }
                     },
                     {
                        "id":"ConsentCredential",
                        "name":"ConsentCredential",
                        "purpose":"One consent credential is required for this presentation",
                        "group":[
                           "A"
                        ],
                        "constraints":{
                           "subject_is_issuer":"required",
                           "fields":[
                              {
                                 "path":[
                                    "$.type"
                                 ],
                                 "filter":{
                                    "type":"array",
                                    "contains":{
                                       "type":"string",
                                       "const":"ConsentCredential"
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
         "url":"FILL YOUR CALLBACK URL, for example 'https://webhook.site/efb19fb8-2579-4e1b-8614-d5a03edaaa7a'"
      }
   ]
}
```