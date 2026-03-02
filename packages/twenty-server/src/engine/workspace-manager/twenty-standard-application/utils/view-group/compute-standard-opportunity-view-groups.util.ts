import { type FlatViewGroup } from 'src/engine/metadata-modules/flat-view-group/types/flat-view-group.type';
import {
    createStandardViewGroupFlatMetadata,
    type CreateStandardViewGroupArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-group/create-standard-view-group-flat-metadata.util';

// LGP QMA Pipeline stages — Kanban columns
export const computeStandardOpportunityViewGroups = (
  args: Omit<CreateStandardViewGroupArgs<'opportunity'>, 'context'>,
): Record<string, FlatViewGroup> => {
  return {
    byStageNew: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'new',
        isVisible: true,
        fieldValue: 'NEW',
        position: 0,
      },
    }),
    byStageContacted: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'contacted',
        isVisible: true,
        fieldValue: 'CONTACTED',
        position: 1,
      },
    }),
    byStageDiscoveryCallBooked: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'discoveryCallBooked',
        isVisible: true,
        fieldValue: 'DISCOVERY_CALL_BOOKED',
        position: 2,
      },
    }),
    byStageDiscoveryCallCompleted: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'discoveryCallCompleted',
        isVisible: true,
        fieldValue: 'DISCOVERY_CALL_COMPLETED',
        position: 3,
      },
    }),
    byStageIntakeCompleted: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'intakeCompleted',
        isVisible: true,
        fieldValue: 'INTAKE_COMPLETED',
        position: 4,
      },
    }),
    byStageProposal: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'proposal',
        isVisible: true,
        fieldValue: 'PROPOSAL',
        position: 5,
      },
    }),
    byStageNegotiations: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'negotiations',
        isVisible: true,
        fieldValue: 'NEGOTIATIONS',
        position: 6,
      },
    }),
    byStageContractAndPayment: createStandardViewGroupFlatMetadata({
      ...args,
      objectName: 'opportunity',
      context: {
        viewName: 'byStage',
        viewGroupName: 'contractAndPayment',
        isVisible: true,
        fieldValue: 'CONTRACT_AND_PAYMENT',
        position: 7,
      },
    }),
  };
};
