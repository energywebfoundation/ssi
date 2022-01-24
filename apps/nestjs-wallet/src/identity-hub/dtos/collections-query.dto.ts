import { ValidateNested } from 'class-validator';
import { CollectionsQueryDescriptorDto } from './collections-query-descriptor.dto';

/**
 * A "CollectionsQuery" message, structed according to:
 * https://identity.foundation/identity-hub/spec/#query
 */
export class CollectionsQueryDto {
  /**
   * Message Descriptor
   */
  @ValidateNested()
  descriptor: CollectionsQueryDescriptorDto;
}
