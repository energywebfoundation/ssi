Sample Exchange Definition for a issuance and self-signed credential.

Use cases: 

1. Holder needs to present two VCs one issued by authority and a self signed credential which can be executed with exchange-definition of type `PresentationDefinition`.

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