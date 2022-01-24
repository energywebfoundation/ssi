import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionsQueryDto } from './dtos/collections-query.dto';
import { CollectionsWriteDto } from './dtos/collections-write.dto';
import { CollectionsDocumentEntity } from './entities/collections-document.entity';

@Injectable()
export class IdentityHubService {
  constructor(
    @InjectRepository(CollectionsDocumentEntity)
    private collectionsDocumentRepository: Repository<CollectionsDocumentEntity>
  ) {}

  /**
   * Process Queries to the "Collections" interface https://identity.foundation/identity-hub/spec/#query
   */
  async processCollectionsQuery(queryMessage: CollectionsQueryDto): Promise<CollectionsDocumentEntity[]> {
    const results = await this.collectionsDocumentRepository
      .createQueryBuilder('documents')
      .where('documents.schema = :schema', { schema: queryMessage.descriptor.schema })
      .getMany();
    return results;
  }

  /**
   * Process Writes to the "Collections" interface https://identity.foundation/identity-hub/spec/#write-2
   */
  async processCollectionsWrite(writeMessage: CollectionsWriteDto) {
    const collectionsDocument = this.collectionsDocumentRepository.create();
    collectionsDocument.document = writeMessage.data;
    collectionsDocument.id = writeMessage.descriptor.cid;
    collectionsDocument.schema = writeMessage.descriptor.schema;
    await this.collectionsDocumentRepository.save(collectionsDocument);
  }
}
