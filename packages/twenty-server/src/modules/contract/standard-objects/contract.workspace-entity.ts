import { type ActorMetadata, type LinksMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type QuoteWorkspaceEntity } from 'src/modules/cpq/standard-objects/quote.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';

const CONTRACT_TYPE_FIELD_NAME = 'contractType';

export const SEARCH_FIELDS_FOR_CONTRACT: FieldTypeAndNameMetadata[] = [
  { name: CONTRACT_TYPE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class ContractWorkspaceEntity extends BaseWorkspaceEntity {
  // Contract metadata
  contractType: string;
  status: string;
  externalSignatureId: string | null;

  // Timestamps
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  expiresAt: string | null;

  // Document
  documentUrl: LinksMetadata | null;

  // Standard fields
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;

  // Relations
  quote: EntityRelation<QuoteWorkspaceEntity> | null;
  quoteId: string | null;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
}
