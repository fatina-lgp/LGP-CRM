import {
    type ActorMetadata,
    type CurrencyMetadata,
    type EmailsMetadata,
    type LinksMetadata,
    type PhonesMetadata,
    FieldMetadataType,
} from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { type CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { type FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { type NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { type TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { type TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

const FIRST_NAME_FIELD_NAME = 'firstName';
const LAST_NAME_FIELD_NAME = 'lastName';
const COMPANY_NAME_FIELD_NAME = 'companyName';

export const SEARCH_FIELDS_FOR_LEAD: FieldTypeAndNameMetadata[] = [
  { name: FIRST_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: LAST_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: COMPANY_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class LeadWorkspaceEntity extends BaseWorkspaceEntity {
  // Lead-specific fields
  firstName: string | null;
  lastName: string | null;
  email: EmailsMetadata | null;
  phone: PhonesMetadata | null;
  jobTitle: string | null;
  linkedinLink: LinksMetadata | null;

  // Scoring fields
  leadScore: number | null;
  leadStatus: string;
  engagementLevel: string;
  lastContactedAt: string | null;
  lastScoredAt: string | null;
  scoringNotes: string | null;

  // Intake fields
  intakeSource: string;
  intakeSourceDetail: string | null;

  // Firmographic fields
  industry: string | null;
  companyName: string | null;
  companySize: string | null;
  annualRevenue: CurrencyMetadata | null;
  region: string | null;

  // Standard fields
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;

  // Relations
  company: EntityRelation<CompanyWorkspaceEntity> | null;
  companyId: string | null;
  owner: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  ownerId: string | null;
  taskTargets: EntityRelation<TaskTargetWorkspaceEntity[]>;
  noteTargets: EntityRelation<NoteTargetWorkspaceEntity[]>;
  favorites: EntityRelation<FavoriteWorkspaceEntity[]>;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]>;
  timelineActivities: EntityRelation<TimelineActivityWorkspaceEntity[]>;
}
