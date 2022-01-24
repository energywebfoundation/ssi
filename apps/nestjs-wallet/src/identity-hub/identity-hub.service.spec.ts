import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmSQLiteModule } from '../in-memory-db';
import { CollectionsQueryDto } from './dtos/collections-query.dto';
import { CollectionsWriteDto } from './dtos/collections-write.dto';
import { CollectionsDocumentEntity } from './entities/collections-document.entity';
import { IdentityHubService } from './identity-hub.service';
import { calculateCID } from './ipfs-hash';

describe('IdentityHubService', () => {
  let service: IdentityHubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmSQLiteModule(), TypeOrmModule.forFeature([CollectionsDocumentEntity])],
      providers: [IdentityHubService]
    }).compile();

    service = module.get<IdentityHubService>(IdentityHubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should write and query a credential', async () => {
    // Example credential from https://www.w3.org/TR/vc-data-model/#example-a-simple-example-of-a-verifiable-credential
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      id: 'http://example.edu/credentials/1872',
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuer: 'https://example.edu/issuers/565049',
      issuanceDate: '2010-01-01T19:23:24Z',
      credentialSubject: {
        id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
        alumniOf: {
          id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
          name: [
            {
              value: 'Example University',
              lang: 'en'
            },
            {
              value: "Exemple d'Université",
              lang: 'fr'
            }
          ]
        }
      },
      proof: {
        type: 'RsaSignature2018',
        created: '2017-06-18T21:19:10Z',
        proofPurpose: 'assertionMethod',
        verificationMethod: 'https://example.edu/issuers/565049/keys/1',
        jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..TCYt5XsITJX1CxPCT8yAV-TVkIEq_PbChOMqsLfRoPsnsgw5WEuts01mq-pQy7UJiN5mgRxD-WUcX16dUEMGlv50aqzpqh4Qktb3rk-BuQy72IFLOqV0G_zS245-kronKb78cPN25DGlcTwLtjPAYuNzVBAh4vGHSrQyHUdBBPM'
      }
    };
    const schema = 'https://www.w3.org/2018/credentials/examples/v1/AlumniCredential';
    const credentialWrite = new CollectionsWriteDto();
    credentialWrite.data = credential;
    credentialWrite.descriptor = {
      cid: await calculateCID(credential),
      schema
    };
    const credentialQuery = new CollectionsQueryDto();
    credentialQuery.descriptor = {
      schema
    };
    await service.processCollectionsWrite(credentialWrite);
    const queryResult = await service.processCollectionsQuery(credentialQuery);
    expect(queryResult).toHaveLength(1);
  });
});
