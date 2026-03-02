import { type ActorMetadata, type LinksMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CalendarEventWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event.workspace-entity';
import { type LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

const CALL_TYPE_FIELD_NAME = 'callType';

export const SEARCH_FIELDS_FOR_DISCOVERY_CALL: FieldTypeAndNameMetadata[] = [
  { name: CALL_TYPE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class DiscoveryCallWorkspaceEntity extends BaseWorkspaceEntity {
  // Call metadata
  callType: string;
  callStatus: string;
  recordingUrl: LinksMetadata | null;
  duration: number | null;
  scheduledAt: string | null;
  completedAt: string | null;
  attendeeCount: number | null;

  // AI summary
  aiSummary: string | null;
  actionItems: string | null;

  // Standard fields
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;

  // Relations
  calendarEvent: EntityRelation<CalendarEventWorkspaceEntity> | null;
  calendarEventId: string | null;
  lead: EntityRelation<LeadWorkspaceEntity> | null;
  leadId: string | null;
  opportunity: EntityRelation<OpportunityWorkspaceEntity> | null;
  opportunityId: string | null;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
}
