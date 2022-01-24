import { ValidateNested } from 'class-validator';
import { CollectionsDocumentDto } from './collections-document.dto';
import { CollectionsWriteDescriptorDto } from './collections-write-descriptor.dto';

/**
 * A "CollectionsWrite" message, structed according to:
 * https://identity.foundation/identity-hub/spec/#write-2
 */
export class CollectionsWriteDto {
  /**
   * Data to be written
   */
  @ValidateNested()
  data: CollectionsDocumentDto;

  @ValidateNested()
  descriptor: CollectionsWriteDescriptorDto;
}
