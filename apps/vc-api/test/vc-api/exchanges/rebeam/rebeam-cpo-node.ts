import { plainToClass } from 'class-transformer';
import { ExchangeDefinitionDto } from '../../../../src/vc-api/exchanges/dtos/exchange-definition.dto';
import { VpRequestInteractServiceType } from '../../../../src/vc-api/exchanges/types/vp-request-interact-service-type';
import { VpRequestQueryType } from '../../../../src/vc-api/exchanges/types/vp-request-query-type';

export class RebeamCpoNode {
  #exchangeId = `b229a18f-db45-4b33-8d36-25d442467bab`;
  #callbackUrl: string;
  queryType = VpRequestQueryType.presentationDefinition;

  constructor(callbackUrl: string) {
    this.#callbackUrl = callbackUrl;
  }

  getExchangeId(): string {
    return this.#exchangeId;
  }

  getExchangeDefinition(): ExchangeDefinitionDto {
    const exchangeDefinition: ExchangeDefinitionDto = {
      exchangeId: this.#exchangeId,
      query: [
        {
          type: this.queryType,
          credentialQuery: [
            {
              presentationDefinition: {
                id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
                input_descriptors: [
                  {
                    id: 'energy_supplier_customer_contract',
                    name: 'Energy Supplier Customer Contract',
                    purpose: 'An energy supplier contract is needed for Rebeam authorization',
                    constraints: {
                      fields: [
                        {
                          path: ['$.credentialSubject.role.namespace'],
                          filter: {
                            type: 'string',
                            const: 'customer.roles.rebeam.apps.eliagroup.iam.ewc'
                          }
                        },
                        {
                          path: ['$.credentialSubject.issuerFields[*].key'],
                          filter: {
                            type: 'string',
                            const: 'accountId'
                          }
                        }
                      ]
                    }
                  },
                  {
                    "id":"charging_data",
                    "name":"Data needs to be signed by the user",
                    "purpose":"Data needs to be signed by the user to end the charging",
                    "constraints":{
                       "is_holder":true,
                       "fields":[
                          {
                             "path":[
                                "$.credentialSubject.chargingData.contractDID"
                             ],
                             "filter":{
                                "type":"string",
                                "const":"did:ethr:blxm-local:0x429eCb49aAC34E076f19D5C91d7e8B956AEf9c08"
                             }
                          },
                          {
                             "path":[
                                "$.credentialSubject.chargingData.evseId"
                             ],
                             "filter":{
                                "type":"string",
                                "const":"123"
                             }
                          },
                          {
                             "path":[
                                "$.credentialSubject.chargingData.timeStamp"
                             ],
                             "filter":{
                                "type":"string",
                                "const":"2022-04-05T15:45:35.346Z"
                             }
                          },
                          {
                             "path":[
                                "$.credentialSubject.chargingData.kwh"
                             ],
                             "filter":{
                                "type":"string",
                                "const":"5"
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
      interactServices: [
        {
          type: VpRequestInteractServiceType.unmediatedPresentation
        }
      ],
      isOneTime: true,
      callback: [
        {
          url: this.#callbackUrl
        }
      ]
    };
    return plainToClass(ExchangeDefinitionDto, exchangeDefinition);
  }

  getInvalidExchangeDefinition(): ExchangeDefinitionDto {
    const exchangeDefinition: ExchangeDefinitionDto = {
      exchangeId: this.#exchangeId,
      query: [
        {
          type: this.queryType,
          credentialQuery: [
            {
              presentationDefinition: {
                id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
                input_descriptors: [
                  {
                    id: 'energy_supplier_customer_contract'
                  }
                ]
              }
            },
            {
              presentationDefinition: {
                id: '286bc1e0-f1bd-488a-a873-8d71be3c690c',
                input_descriptors: [
                  {
                    id: 'energy_supplier_employer_contract'
                  }
                ]
              }
            }
          ]
        }
      ],
      interactServices: [],
      isOneTime: true,
      callback: []
    };
    return plainToClass(ExchangeDefinitionDto, exchangeDefinition);
  }
}
