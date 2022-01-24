import { Column, Entity, ManyToOne } from 'typeorm';

/**
 * A TypeOrm entity representing a document that would be persisted to an Identity Hub collection
 */
@Entity()
export class CollectionsDocumentEntity {
  /**
   * Document id.
   * Expect that it be a [v1 CID](https://docs.ipfs.io/concepts/content-addressing/#identifier-formats)
   */
  @Column('text', { primary: true })
  id: string;

  /**
   * The document data
   */
  @Column('simple-json')
  document: Record<string, any>;

  /**
   * https://identity.foundation/identity-hub/spec/#collections
   * "By storing data in accordance with a given schema, which may be well-known in a given vertical or industry,
   * apps and services can leverage the same datasets across one another,
   * enabling a cohesive, cross-platform, cross-device, cross-app experience for users."
   * The schema can be used for querying: https://github.com/decentralized-identity/identity-hub/issues/76
   */
  @Column('text')
  schema: string;
}
