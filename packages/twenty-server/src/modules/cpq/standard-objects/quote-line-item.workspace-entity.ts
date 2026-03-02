import { type ActorMetadata, type CurrencyMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type QuoteWorkspaceEntity } from 'src/modules/cpq/standard-objects/quote.workspace-entity';

const DESCRIPTION_FIELD_NAME = 'description';

export const SEARCH_FIELDS_FOR_QUOTE_LINE_ITEM: FieldTypeAndNameMetadata[] = [
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class QuoteLineItemWorkspaceEntity extends BaseWorkspaceEntity {
  // Line item details
  description: string;
  sku: string | null;
  category: string;
  quantity: number;
  unitPrice: CurrencyMetadata | null;
  totalPrice: CurrencyMetadata | null;
  sortOrder: number;

  // Standard fields
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;

  // Relations
  quote: EntityRelation<QuoteWorkspaceEntity> | null;
  quoteId: string | null;
}
