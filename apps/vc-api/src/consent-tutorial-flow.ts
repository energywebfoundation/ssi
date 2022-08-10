import axios, { Axios } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DIDDocument } from 'did-resolver/src/resolver';
import { ExchangeResponseDto } from './vc-api/exchanges/dtos/exchange-response.dto';
import { VerifiableCredentialDto } from './vc-api/credentials/dtos/verifiable-credential.dto';
import { VerifiablePresentationDto } from './vc-api/credentials/dtos/verifiable-presentation.dto';

const axiosInstanceVcApi: Axios = axios.create({
  baseURL: 'http://localhost:3000',
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
  timeout: 0
});

const axiosInstanceIDCApi: Axios = axios.create({
  baseURL: 'http://localhost:3001',
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
  timeout: 0
});

(async () => {
  const exchangeId = uuidv4();
  await createExchange(exchangeId);
  const exchangeInitResponse = await initiateIssuanceExchange(exchangeId);
  const didDoc = await generateDid();
  const credential = await convertInputDescriptorToCredential();
  const selfSignedCredential = await issueSelfSignedCredential(credential, didDoc.id);

  const presentation = await createPresentationWithSSCredential(
    selfSignedCredential,
    didDoc.id,
    didDoc.verificationMethod[0].id,
    exchangeInitResponse.vpRequest.challenge
  );

  await presentationSubmission(
    exchangeInitResponse.vpRequest.interact.service[0].serviceEndpoint,
    presentation
  );

  log('flow finished');
})().catch((err) => {
  if (err.isAxiosError) {
    log(`${err.toString()}, body: ${JSON.stringify(err?.response?.data)}`);
  } else {
    log(err.message);
  }
});

/**
 * Step 1
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#1-consent-requesting-portal-configure-the-consent-request-exchange}
 */
async function createExchange(exchangeId: string): Promise<{ errors: unknown[] }> {
  log('creating exchange');
  const { data } = await axiosInstanceVcApi.post('/v1/vc-api/exchanges', {
    exchangeId,
    query: [
      {
        type: 'PresentationDefinition',
        credentialQuery: [
          {
            presentationDefinition: {
              id: '286bc1e0-f1bd-488a-a873-8d71be3c690e',
              input_descriptors: [
                {
                  id: 'consent_agreement',
                  name: 'Consent Agreement',
                  constraints: {
                    subject_is_issuer: 'required',
                    fields: [
                      {
                        path: ['$.id'],
                        filter: {
                          const: 'urn:uuid:49f69fb8-f256-4b2e-b15d-c7ebec3a507e'
                        }
                      },
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
                              $ref: '#/definitions/eliaGroupContext'
                            }
                          ],
                          additionalItems: false,
                          minItems: 2,
                          maxItems: 2,
                          definitions: {
                            eliaGroupContext: {
                              type: 'object',
                              properties: {
                                elia: {
                                  const: 'https://www.eliagroup.eu/ld-context-2022#'
                                },
                                consent: {
                                  const: 'elia:consent'
                                }
                              },
                              additionalProperties: false,
                              required: ['elia', 'consent']
                            }
                          }
                        }
                      },
                      {
                        path: ['$.credentialSubject'],
                        filter: {
                          type: 'object',
                          properties: {
                            consent: {
                              const: 'I consent to such and such'
                            }
                          },
                          additionalProperties: false
                        }
                      },
                      {
                        path: ['$.type'],
                        filter: {
                          type: 'array',
                          items: [
                            {
                              const: 'VerifiableCredential'
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
    interactServices: [
      {
        type: 'UnmediatedHttpPresentationService2021'
      }
    ],
    callback: [
      {
        url: 'https://webhook.site/ab3394fe-56ba-4268-ab91-7f07665d41e5'
      }
    ],
    isOneTime: true
  });

  if (data.errors.length > 0) {
    throw new Error(data.errors.join);
  }

  // log(`exchange ${exchangeId} configured - ${JSON.stringify(data)}`);

  return data;
}

/**
 * Step 3
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#3-consenter-initiate-issuance-exchange-using-the-request-url}
 */
async function initiateIssuanceExchange(exchangeId: string): Promise<ExchangeResponseDto> {
  log('initiating issuance exchange');
  const { data } = await axiosInstanceVcApi.post(`/v1/vc-api/exchanges/${exchangeId}`);
  // log(`issuance exchange initiated: ${JSON.stringify(data)}`);

  return data;
}

/**
 * Step 4
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#4-consenter-create-a-did}
 */
async function generateDid(): Promise<DIDDocument> {
  log('generating DID');
  const { data } = await axiosInstanceVcApi.post('/v1/did', { method: 'key' });
  // log(`generated did - ${JSON.stringify(data)}`);
  return data;
}

/**
 * Step 5
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#5-consenter-convert-the-input-descriptor-to-a-credential}
 */
async function convertInputDescriptorToCredential(): Promise<Record<string, any>> {
  log('converting ID to credential');
  const inputDescriptor = {
    constraints: {
      subject_is_issuer: 'required',
      fields: [
        {
          path: ['$.id'],
          filter: {
            const: 'urn:uuid:49f69fb8-f256-4b2e-b15d-c7ebec3a507e'
          }
        },
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
                $ref: '#/definitions/eliaGroupContext'
              }
            ],
            additionalItems: false,
            minItems: 2,
            maxItems: 2,
            definitions: {
              eliaGroupContext: {
                type: 'object',
                properties: {
                  elia: {
                    const: 'https://www.eliagroup.eu/ld-context-2022#'
                  },
                  consent: {
                    const: 'elia:consent'
                  }
                },
                additionalProperties: false,
                required: ['elia', 'consent']
              }
            }
          }
        },
        {
          path: ['$.credentialSubject'],
          filter: {
            type: 'object',
            properties: {
              consent: {
                const: 'I consent to such and such'
              }
            },
            additionalProperties: false
          }
        },
        {
          path: ['$.type'],
          filter: {
            type: 'array',
            items: [
              {
                const: 'VerifiableCredential'
              }
            ]
          }
        }
      ]
    }
  };

  const { data } = await axiosInstanceIDCApi.post(
    '/converter/input-descriptor-to-credential',
    inputDescriptor
  );

  return data.credential;
}

/**
 * Step 6
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#6-consenter-issue-a-self-signed-credential}
 */
async function issueSelfSignedCredential(
  credential: Record<string, any>,
  issuer: string
): Promise<VerifiableCredentialDto> {
  log('issuing self-signed credential');
  const { data } = await axiosInstanceVcApi
    .post(`/v1/vc-api/credentials/issue`, {
      credential: {
        ...credential,
        issuer,
        issuanceDate: '2022-10-03T12:19:52Z'
      },
      options: {}
    })
    .catch((err) => {
      throw err;
    });

  return data;
}

/**
 * step 7:
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#7-consenter-create-a-presentation-with-the-self-signed-credential}
 */
async function createPresentationWithSSCredential(
  verifiableCredential: Record<string, unknown>,
  holder: string,
  verificationMethod: string,
  challenge: string
): Promise<VerifiablePresentationDto> {
  log('creating VP');
  const { data } = await axiosInstanceVcApi.post(`/v1/vc-api/presentations/prove`, {
    presentation: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiablePresentation'],
      verifiableCredential: [verifiableCredential],
      holder
    },
    options: {
      verificationMethod: verificationMethod,
      proofPurpose: 'authentication',
      challenge
    }
  });

  return data;
}

/**
 * Step 8
 * {@link https://github.com/energywebfoundation/ssi/blob/docs/IVA-37/add-self-signed-cred-to-tut/apps/vc-api/docs/tutorials/consent-tutorial.md#8-consenter-continue-exchange-by-submitting-the-presentation}
 */
async function presentationSubmission(serviceEndpoint: string, presentation) {
  log(`submitting presentation to the service endpoint: ${serviceEndpoint}`);
  const { data } = await axiosInstanceVcApi.put(serviceEndpoint, presentation);

  return data;
}

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}
