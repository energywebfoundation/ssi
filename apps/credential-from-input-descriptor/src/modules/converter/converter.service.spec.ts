import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from './converter.service';
import { InputDesciptorToCredentialDto } from './dtos';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConverterService]
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertInputDescriptorToCredential', function () {
    it('should be defined', function () {
      expect(service.convertInputDescriptorToCredential).toBeDefined();
    });

    describe('when called with valid input', function () {
      const input: InputDesciptorToCredentialDto = {
        constraints: {
          fields: [
            {
              path: '$.@context',
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
                        const: 'https://https://www.eliagroup.eu/ld-context-2022#'
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
            }
          ]
        }
      };

      it('should execute', async function () {
        await service.convertInputDescriptorToCredential(input);
      });

      describe('then, execution result', function () {
        let result;

        beforeEach(async function () {
          result = await service.convertInputDescriptorToCredential(input);
        });

        it('should be defined', async function () {
          expect(result).toBeDefined();
        });

        it('should match expected result', async function () {
          expect(result).toEqual({
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              {
                consent: 'elia:consent',
                elia: 'https://https://www.eliagroup.eu/ld-context-2022#'
              }
            ]
          });
        });
      });
    });
  });
});
