import {
    type ActorMetadata,
    type CurrencyMetadata,
    FieldMetadataType,
} from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type LeadWorkspaceEntity } from 'src/modules/lead/standard-objects/lead.workspace-entity';
import { type OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { type WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

const BUDGET_OWNER_FIELD_NAME = 'budgetOwner';

export const SEARCH_FIELDS_FOR_INTAKE_QUALIFIER: FieldTypeAndNameMetadata[] = [
  { name: BUDGET_OWNER_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class IntakeQualifierWorkspaceEntity extends BaseWorkspaceEntity {
  // Qualifier fields (mandatory for stage advancement)
  budgetOwner: string | null;
  budgetAmount: CurrencyMetadata | null;
  headcount: number | null;
  decisionTimeline: string | null;

  // Additional qualifier fields
  currentSolution: string | null;
  painPoints: string | null;
  eventDate: string | null;
  tier: string | null;

  // Completion gate
  isComplete: boolean;
  submittedAt: string | null;

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
  submittedBy: EntityRelation<WorkspaceMemberWorkspaceEntity> | null;
  submittedById: string | null;
}
