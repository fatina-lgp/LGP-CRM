import { type ActorMetadata, type LinksMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';

const DOCUMENT_NAME_FIELD_NAME = 'documentName';

export const SEARCH_FIELDS_FOR_DOCUMENT_TRACKING: FieldTypeAndNameMetadata[] = [
  { name: DOCUMENT_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class DocumentTrackingWorkspaceEntity extends BaseWorkspaceEntity {
  // Document metadata
  documentName: string;
  documentType: string;
  documentUrl: LinksMetadata | null;

  // Tracking event
  eventType: string;
  eventTimestamp: string;

  // Recipient info
  recipientEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;

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
