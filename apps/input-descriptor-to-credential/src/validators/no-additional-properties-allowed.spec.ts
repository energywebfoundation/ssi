/*
 * Copyright 2021 - 2023 Energy Web Foundation
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

import { NoAdditionalPropertiesConstraint } from './no-additional-properties-allowed';

describe(NoAdditionalPropertiesConstraint.name, function () {
  let instance: NoAdditionalPropertiesConstraint;

  beforeEach(async function () {
    jest.resetAllMocks();

    instance = new NoAdditionalPropertiesConstraint();
  });

  describe('when called for an input descriptor with no "additionalProperties":true value', function () {
    const data = {
      constraints: {
        fields: [
          {
            path: ['$.@context'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'array',
              items: [
                {
                  const: 'https://www.w3.org/2018/credentials/v1'
                },
                {
                  $ref: '#/definitions/agrees-to'
                },
                {
                  $ref: '#/definitions/context-2'
                }
              ],
              additionalItems: false,
              minItems: 3,
              maxItems: 3,
              definitions: {
                'agrees-to': {
                  type: 'object',
                  additionalProperties: false,
                  required: ['agreesTo'],
                  properties: {
                    agreesTo: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['@id', '@context'],
                      properties: {
                        '@id': {
                          const:
                            'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/agreesTo'
                        },
                        '@context': {
                          type: 'object',
                          additionalProperties: false,
                          required: [
                            'applicationLaw',
                            'compensationOfTheOffer',
                            'contractedItem',
                            'expressionOfTheOffer',
                            'jurisdiction',
                            'party1',
                            'party2'
                          ],
                          properties: {
                            applicationLaw: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/applicationLaw'
                            },
                            compensationOfTheOffer: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/compensationOfTheOffer'
                            },
                            contractedItem: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/contractedItem'
                            },
                            expressionOfTheOffer: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/expressionOfTheOffer'
                            },
                            jurisdiction: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/jurisdiction'
                            },
                            party1: {
                              type: 'object',
                              additionalProperties: false,
                              required: ['@id', '@context'],
                              properties: {
                                '@id': {
                                  const:
                                    'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/party1'
                                },
                                '@context': {
                                  type: 'object',
                                  additionalProperties: false,
                                  required: ['address', 'brand', 'iso6523Code'],
                                  properties: {
                                    address: {
                                      const: 'https://schema.org/address'
                                    },
                                    brand: {
                                      const: 'https://schema.org/brand'
                                    },
                                    iso6523Code: {
                                      const: 'https://schema.org/iso6523Code'
                                    }
                                  }
                                }
                              }
                            },
                            party2: {
                              type: 'object',
                              additionalProperties: false,
                              required: ['@id', '@context'],
                              properties: {
                                '@id': {
                                  const:
                                    'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/party2'
                                },
                                '@context': {
                                  type: 'object',
                                  additionalProperties: false,
                                  required: ['address', 'familyName', 'givenName'],
                                  properties: {
                                    address: {
                                      const: 'https://schema.org/address'
                                    },
                                    familyName: {
                                      const: 'https://schema.org/familyName'
                                    },
                                    givenName: {
                                      const: 'https://schema.org/givenName'
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                'context-2': {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'ContractCredential',
                    'ContractParty',
                    'Contract',
                    'Device',
                    'Organization',
                    'Person'
                  ],
                  properties: {
                    ContractCredential: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/ContractCredential'
                    },
                    ContractParty: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/ContractParty'
                    },
                    Contract: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/Contract'
                    },
                    Device: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/Device'
                    },
                    Organization: {
                      const: 'https://schema.org/Organization'
                    },
                    Person: {
                      const: 'https://schema.org/Person'
                    }
                  }
                }
              }
            }
          },
          {
            path: ['$.type'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'array',
              items: [
                {
                  const: 'VerifiableCredential'
                },
                {
                  const: 'ContractCredential'
                }
              ],
              additionalItems: false,
              minItems: 2,
              maxItems: 2
            }
          },
          {
            path: ['$.id'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: 'https://example.com/credential/1'
            }
          },
          {
            path: ['$.credentialSubject'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'object',
              additionalProperties: false,
              required: ['type', 'id', 'agreesTo'],
              properties: {
                type: {
                  const: 'ContractParty'
                },
                id: {
                  const: 'did:example:subject'
                },
                agreesTo: {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'type',
                    'id',
                    'applicationLaw',
                    'compensationOfTheOffer',
                    'contractedItem',
                    'counterParty',
                    'expressionOfTheOffer',
                    'jurisdiction'
                  ],
                  properties: {
                    type: {
                      const: 'Contract'
                    },
                    id: {
                      const: 'contractIdScheme:456'
                    },
                    applicationLaw: {
                      const: 'Belgium laws'
                    },
                    compensationOfTheOffer: {
                      const: '0'
                    },
                    contractedItem: {
                      type: 'object',
                      required: ['type', 'id'],
                      additionalProperties: false,
                      properties: {
                        type: {
                          const: 'Device'
                        },
                        id: {
                          const: 'deviceIdScheme:123'
                        }
                      }
                    },
                    party1: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['type', 'brand', 'address', 'iso6523Code'],
                      properties: {
                        type: {
                          const: 'Organization'
                        },
                        brand: {
                          const: 'Car Manufacturer Inc'
                        },
                        address: {
                          const: "Boulevard de l'Empereur, 1000 Bruxelles"
                        },
                        iso6523Code: {
                          const: '123456789'
                        }
                      }
                    },
                    party2: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['type', 'address', 'givenName', 'familyName'],
                      properties: {
                        type: {
                          const: 'Person'
                        },
                        givenName: {
                          const: 'John'
                        },
                        address: {
                          const: "Boulevard de l'Empereur, 1000 Bruxelles"
                        },
                        familyName: {
                          const: 'Doe'
                        }
                      }
                    },
                    expressionOfTheOffer: {
                      const:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
                    },
                    jurisdiction: {
                      const: 'Courts of Bruxelles'
                    }
                  }
                }
              }
            }
          },
          {
            path: ['$.issuer'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: 'did:example:dso'
            }
          },
          {
            path: ['$.issuanceDate'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: '2023-05-14T12:55:30Z'
            }
          }
        ]
      }
    };

    it('should return true', async function () {
      expect(instance.validate(data)).toBe(true);
    });
  });
  describe('when called for an input descriptor with any "additionalProperties":true value', function () {
    const data = {
      constraints: {
        fields: [
          {
            path: ['$.@context'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'array',
              items: [
                {
                  const: 'https://www.w3.org/2018/credentials/v1'
                },
                {
                  $ref: '#/definitions/agrees-to'
                },
                {
                  $ref: '#/definitions/context-2'
                }
              ],
              additionalItems: false,
              minItems: 3,
              maxItems: 3,
              definitions: {
                'agrees-to': {
                  type: 'object',
                  additionalProperties: false,
                  required: ['agreesTo'],
                  properties: {
                    agreesTo: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['@id', '@context'],
                      properties: {
                        '@id': {
                          const:
                            'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/agreesTo'
                        },
                        '@context': {
                          type: 'object',
                          additionalProperties: false,
                          required: [
                            'applicationLaw',
                            'compensationOfTheOffer',
                            'contractedItem',
                            'expressionOfTheOffer',
                            'jurisdiction',
                            'party1',
                            'party2'
                          ],
                          properties: {
                            applicationLaw: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/applicationLaw'
                            },
                            compensationOfTheOffer: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/compensationOfTheOffer'
                            },
                            contractedItem: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/contractedItem'
                            },
                            expressionOfTheOffer: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/expressionOfTheOffer'
                            },
                            jurisdiction: {
                              const:
                                'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/jurisdiction'
                            },
                            party1: {
                              type: 'object',
                              additionalProperties: false,
                              required: ['@id', '@context'],
                              properties: {
                                '@id': {
                                  const:
                                    'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/party1'
                                },
                                '@context': {
                                  type: 'object',
                                  additionalProperties: true,
                                  required: ['address', 'brand', 'iso6523Code'],
                                  properties: {
                                    address: {
                                      const: 'https://schema.org/address'
                                    },
                                    brand: {
                                      const: 'https://schema.org/brand'
                                    },
                                    iso6523Code: {
                                      const: 'https://schema.org/iso6523Code'
                                    }
                                  }
                                }
                              }
                            },
                            party2: {
                              type: 'object',
                              additionalProperties: false,
                              required: ['@id', '@context'],
                              properties: {
                                '@id': {
                                  const:
                                    'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/party2'
                                },
                                '@context': {
                                  type: 'object',
                                  additionalProperties: false,
                                  required: ['address', 'familyName', 'givenName'],
                                  properties: {
                                    address: {
                                      const: 'https://schema.org/address'
                                    },
                                    familyName: {
                                      const: 'https://schema.org/familyName'
                                    },
                                    givenName: {
                                      const: 'https://schema.org/givenName'
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                'context-2': {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'ContractCredential',
                    'ContractParty',
                    'Contract',
                    'Device',
                    'Organization',
                    'Person'
                  ],
                  properties: {
                    ContractCredential: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/ContractCredential'
                    },
                    ContractParty: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/ContractParty'
                    },
                    Contract: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/Contract'
                    },
                    Device: {
                      const:
                        'https://github.com/energywebfoundation/elia-energyblocks-vcs/tree/master/ontology/v1/Device'
                    },
                    Organization: {
                      const: 'https://schema.org/Organization'
                    },
                    Person: {
                      const: 'https://schema.org/Person'
                    }
                  }
                }
              }
            }
          },
          {
            path: ['$.type'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'array',
              items: [
                {
                  const: 'VerifiableCredential'
                },
                {
                  const: 'ContractCredential'
                }
              ],
              additionalItems: false,
              minItems: 2,
              maxItems: 2
            }
          },
          {
            path: ['$.id'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: 'https://example.com/credential/1'
            }
          },
          {
            path: ['$.credentialSubject'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'object',
              additionalProperties: false,
              required: ['type', 'id', 'agreesTo'],
              properties: {
                type: {
                  const: 'ContractParty'
                },
                id: {
                  const: 'did:example:subject'
                },
                agreesTo: {
                  type: 'object',
                  additionalProperties: false,
                  required: [
                    'type',
                    'id',
                    'applicationLaw',
                    'compensationOfTheOffer',
                    'contractedItem',
                    'counterParty',
                    'expressionOfTheOffer',
                    'jurisdiction'
                  ],
                  properties: {
                    type: {
                      const: 'Contract'
                    },
                    id: {
                      const: 'contractIdScheme:456'
                    },
                    applicationLaw: {
                      const: 'Belgium laws'
                    },
                    compensationOfTheOffer: {
                      const: '0'
                    },
                    contractedItem: {
                      type: 'object',
                      required: ['type', 'id'],
                      additionalProperties: false,
                      properties: {
                        type: {
                          const: 'Device'
                        },
                        id: {
                          const: 'deviceIdScheme:123'
                        }
                      }
                    },
                    party1: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['type', 'brand', 'address', 'iso6523Code'],
                      properties: {
                        type: {
                          const: 'Organization'
                        },
                        brand: {
                          const: 'Car Manufacturer Inc'
                        },
                        address: {
                          const: "Boulevard de l'Empereur, 1000 Bruxelles"
                        },
                        iso6523Code: {
                          const: '123456789'
                        }
                      }
                    },
                    party2: {
                      type: 'object',
                      additionalProperties: false,
                      required: ['type', 'address', 'givenName', 'familyName'],
                      properties: {
                        type: {
                          const: 'Person'
                        },
                        givenName: {
                          const: 'John'
                        },
                        address: {
                          const: "Boulevard de l'Empereur, 1000 Bruxelles"
                        },
                        familyName: {
                          const: 'Doe'
                        }
                      }
                    },
                    expressionOfTheOffer: {
                      const:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
                    },
                    jurisdiction: {
                      const: 'Courts of Bruxelles'
                    }
                  }
                }
              }
            }
          },
          {
            path: ['$.issuer'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: 'did:example:dso'
            }
          },
          {
            path: ['$.issuanceDate'],
            filter: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              const: '2023-05-14T12:55:30Z'
            }
          }
        ]
      }
    };

    it('should return false', async function () {
      expect(instance.validate(data)).toBe(false);
    });
  });
});
