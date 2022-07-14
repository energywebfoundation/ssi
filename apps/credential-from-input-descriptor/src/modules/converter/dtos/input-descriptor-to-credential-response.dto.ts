export class InputDescriptorToCredentialResponseDto {
  '@context'?: (string | Record<string, unknown>)[];
  credentialSubject?: (string | Record<string, unknown>)[];
  id?: (string | Record<string, unknown>)[];
  issuanceDate?: (string | Record<string, unknown>)[];
  type?: (string | Record<string, unknown>)[];

  constructor(props?: Partial<InputDescriptorToCredentialResponseDto>) {
    Object.assign(this, props);
  }
}
