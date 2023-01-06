// Source: https://github.com/spruceid/ssi/blob/3745b7dfdd18e1b27c6135f8036470efde596f35/did-pkh/tests/vc-eth-eip712sig.jsonld

import {
  CredentialStatusPurpose,
  CredentialType,
  StatusListEntryType
} from '@ew-did-registry/credentials-interface';
import { RoleCredentialSubject } from 'iam-client-lib';
import { VerifiableCredential } from 'src/vc-api/exchanges/types/verifiable-credential';

export const validEnergyWebRoleVC = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential'],
  credentialSubject: {
    id: 'did:example:foo'
  },
  issuer: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758',
  issuanceDate: '2021-03-18T16:38:25Z',
  proof: {
    '@context': 'https://demo.spruceid.com/ld/eip712sig-2021/v0.1.jsonld',
    type: 'EthereumEip712Signature2021',
    proofPurpose: 'assertionMethod',
    proofValue:
      '0x9abee96d684a146aa0b30498d8799ee9a4f8f54488c73d4a4fba3a6fb94eca8764af54f15a24deba0dd9ee2f460d1f6bd174a4ca7504a72d6b1fe9b739d613fe1b',
    verificationMethod: 'did:pkh:eth:0x2fbf1be19d90a29aea9363f4ef0b6bf1c4ff0758#Recovery2020',
    created: '2021-06-17T17:16:39.791Z',
    eip712Domain: {
      domain: {
        name: 'EthereumEip712Signature2021'
      },
      messageSchema: {
        CredentialSubject: [
          {
            name: 'id',
            type: 'string'
          }
        ],
        EIP712Domain: [
          {
            name: 'name',
            type: 'string'
          }
        ],
        Proof: [
          {
            name: '@context',
            type: 'string'
          },
          {
            name: 'verificationMethod',
            type: 'string'
          },
          {
            name: 'created',
            type: 'string'
          },
          {
            name: 'proofPurpose',
            type: 'string'
          },
          {
            name: 'type',
            type: 'string'
          }
        ],
        VerifiableCredential: [
          {
            name: '@context',
            type: 'string[]'
          },
          {
            name: 'type',
            type: 'string[]'
          },
          {
            name: 'issuer',
            type: 'string'
          },
          {
            name: 'issuanceDate',
            type: 'string'
          },
          {
            name: 'credentialSubject',
            type: 'CredentialSubject'
          },
          {
            name: 'proof',
            type: 'Proof'
          }
        ]
      },
      primaryType: 'VerifiableCredential'
    }
  }
};

export const vc = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  id: 'urn:uuid:1feb8928-cdad-4f36-9096-e854151cfef4',
  type: [CredentialType.VerifiableCredential, CredentialType.EWFRole],
  credentialSubject: {
    id: 'did:ethr:0x12047:0xff94d61aab533b585ebd617f44df2c017fc9081a',
    issuerFields: [],
    role: { namespace: 'test.iam.ewc', version: '1' }
  },
  issuer: 'did:ethr:0x12047:0xff94d61aab533b585ebd617f44df2c017fc9081a',
  issuanceDate: '2022-12-14T08:31:17.371Z',
  proof: {
    '@context': 'https://w3id.org/security/suites/eip712sig-2021/v1',
    type: 'EthereumEip712Signature2021',
    proofPurpose: 'assertionMethod',
    proofValue:
      '0xf0f4a027997a59f309ca77431f25f939423541eb40e0b216dbefd4bb9f9fbfa94fbc0a9aa34fc8cd0d0955a70943621fdeb6468471a5abaa4aeee2e4abeb85fd1c',
    verificationMethod: 'did:ethr:0x12047:0xff94d61aab533b585ebd617f44df2c017fc9081a#controller',
    created: '2022-12-14T08:31:17.371Z',
    eip712Domain: {
      domain: {},
      messageSchema: {
        CredentialSubject: [
          { name: 'id', type: 'string' },
          { name: 'role', type: 'EWFRole' },
          { name: 'issuerFields', type: 'IssuerFields[]' }
        ],
        EIP712Domain: [],
        EWFRole: [
          { name: 'namespace', type: 'string' },
          { name: 'version', type: 'string' }
        ],
        IssuerFields: [
          { name: 'key', type: 'string' },
          { name: 'value', type: 'string' }
        ],
        Proof: [
          { name: '@context', type: 'string' },
          { name: 'verificationMethod', type: 'string' },
          { name: 'created', type: 'string' },
          { name: 'proofPurpose', type: 'string' },
          { name: 'type', type: 'string' }
        ],
        StatusList2021Entry: [
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string' },
          { name: 'statusPurpose', type: 'string' },
          { name: 'statusListIndex', type: 'string' },
          { name: 'statusListCredential', type: 'string' }
        ],
        VerifiableCredential: [
          { name: '@context', type: 'string[]' },
          { name: 'id', type: 'string' },
          { name: 'type', type: 'string[]' },
          { name: 'issuer', type: 'string' },
          { name: 'issuanceDate', type: 'string' },
          { name: 'credentialSubject', type: 'CredentialSubject' },
          { name: 'proof', type: 'Proof' },
          { name: 'credentialStatus', type: 'StatusList2021Entry' }
        ]
      },
      primaryType: 'VerifiableCredential'
    }
  },
  credentialStatus: {
    id: 'https://energyweb.org/credential/0x760b59d40ca5be5d197f82df5f7acb8ecaecd5d03c38f91f909e7456ae464430#list',
    type: StatusListEntryType.Entry2021,
    statusListIndex: '1',
    statusPurpose: CredentialStatusPurpose.REVOCATION,
    statusListCredential:
      'https://identitycache.org/v1/status-list/urn:uuid:1feb8928-cdad-4f36-9096-e854151cfef4'
  }
};

export const proofOptions = {
  proofPurpose: 'assertionMethod',
  verificationMethod: '',
  eip712Domain: {
    domain: {
      name: 'EthereumEip712Signature2021'
    },
    messageSchema: {
      CredentialSubject: [
        {
          name: 'id',
          type: 'string'
        }
      ],
      EIP712Domain: [
        {
          name: 'name',
          type: 'string'
        }
      ],
      Proof: [
        {
          name: '@context',
          type: 'string'
        },
        {
          name: 'verificationMethod',
          type: 'string'
        },
        {
          name: 'created',
          type: 'string'
        },
        {
          name: 'proofPurpose',
          type: 'string'
        },
        {
          name: 'type',
          type: 'string'
        }
      ],
      VerifiableCredential: [
        {
          name: '@context',
          type: 'string[]'
        },
        {
          name: 'type',
          type: 'string[]'
        },
        {
          name: 'issuer',
          type: 'string'
        },
        {
          name: 'issuanceDate',
          type: 'string'
        },
        {
          name: 'credentialSubject',
          type: 'CredentialSubject'
        },
        {
          name: 'proof',
          type: 'Proof'
        }
      ]
    },
    primaryType: 'VerifiableCredential'
  }
};

export const keyType = {
  kty: 'EC',
  crv: 'secp256k1',
  alg: 'ES256K-R',
  key_ops: ['signTypedData']
};
