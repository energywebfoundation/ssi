import { IsString } from 'class-validator';

/**
 * A "CollectionsWrite" message descriptor, structed according to:
 * https://identity.foundation/identity-hub/spec/#write-2
 */
export class CollectionsWriteDescriptorDto {
  /**
   * Stringified [Version 1 CID](https://docs.ipfs.io/concepts/content-addressing/#identifier-formats) of the data associated with the message.
   */
  @IsString()
  cid: string;

  /**
   * Schema of the data
   */
  @IsString()
  schema: string;
}
