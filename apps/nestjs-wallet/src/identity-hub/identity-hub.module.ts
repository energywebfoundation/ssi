import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsDocumentEntity } from './entities/collections-document.entity';
import { IdentityHubService } from './identity-hub.service';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionsDocumentEntity])],
  providers: [IdentityHubService]
})
export class IdentityHubModule {}
