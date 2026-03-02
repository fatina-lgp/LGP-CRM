import { type ActorMetadata, type CurrencyMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';

const TIER_FIELD_NAME = 'tier';

export const SEARCH_FIELDS_FOR_QUOTE: FieldTypeAndNameMetadata[] = [
  { name: TIER_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class QuoteWorkspaceEntity extends BaseWorkspaceEntity {
  // Quote metadata
  quoteNumber: string | null;
  tier: string;
  status: string;
  validUntil: string | null;

  // Pricing
  subtotal: CurrencyMetadata | null;
  discount: CurrencyMetadata | null;
  tax: CurrencyMetadata | null;
  total: CurrencyMetadata | null;
  notes: string | null;

  // Standard fields
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;

  // Relations
  lead: EntityRelation<LeadWorkspaceEntity> | null;
  leadId: string | null;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
}
