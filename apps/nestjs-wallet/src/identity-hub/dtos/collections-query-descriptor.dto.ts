import { IsString } from 'class-validator';

/**
 * A "CollectionsWrite" message descriptor, structed according to:
 * https://identity.foundation/identity-hub/spec/#write-2
 */
export class CollectionsQueryDescriptorDto {
  /**
   * Schema of the data
   */
  @IsString()
  schema: string;
}
