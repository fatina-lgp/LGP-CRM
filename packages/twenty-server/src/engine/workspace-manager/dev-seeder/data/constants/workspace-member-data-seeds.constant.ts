import {
    SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { USER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-users.util';

type WorkspaceMemberDataSeed = {
  id: string;
  nameFirstName: string;
  nameLastName: string;
  locale: string;
  colorScheme: string;
  userEmail: string;
  userId: string;
};

export const WORKSPACE_MEMBER_DATA_SEED_COLUMNS: (keyof WorkspaceMemberDataSeed)[] =
  [
    'id',
    'nameFirstName',
    'nameLastName',
    'locale',
    'colorScheme',
    'userEmail',
    'userId',
  ];

export const WORKSPACE_MEMBER_DATA_SEED_IDS = {
  MARKETING: 'b0b20001-0001-4000-8000-000000000001',
  SALES: 'b0b20001-0002-4000-8000-000000000002',
  OPS: 'b0b20001-0003-4000-8000-000000000003',
  // Aliases for backwards-compat with company/opportunity seeds
  TIM: 'b0b20001-0001-4000-8000-000000000001',
  JONY: 'b0b20001-0002-4000-8000-000000000002',
  PHIL: 'b0b20001-0003-4000-8000-000000000003',
  JANE: 'b0b20001-0001-4000-8000-000000000001',
};

export const RANDOM_WORKSPACE_MEMBER_IDS: Record<string, string> = {};

const lgpWorkspaceMembers: WorkspaceMemberDataSeed[] = [
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.MARKETING,
    nameFirstName: 'Marketing',
    nameLastName: 'LGP',
    locale: 'en',
    colorScheme: 'Dark',
    userEmail: 'marketing@lgphub.com',
    userId: USER_DATA_SEED_IDS.MARKETING,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.SALES,
    nameFirstName: 'Sales',
    nameLastName: 'LGP',
    locale: 'en',
    colorScheme: 'Dark',
    userEmail: 'sales@lgphub.com',
    userId: USER_DATA_SEED_IDS.SALES,
  },
  {
    id: WORKSPACE_MEMBER_DATA_SEED_IDS.OPS,
    nameFirstName: 'Ops',
    nameLastName: 'LGP',
    locale: 'en',
    colorScheme: 'Dark',
    userEmail: 'ops@lgphub.com',
    userId: USER_DATA_SEED_IDS.OPS,
  },
];

export const WORKSPACE_MEMBER_DATA_SEEDS: WorkspaceMemberDataSeed[] =
  lgpWorkspaceMembers;

export const getWorkspaceMemberDataSeeds = (
  workspaceId: string,
): WorkspaceMemberDataSeed[] => {
  // LGP workspace — always return LGP members
  if (workspaceId === SEED_YCOMBINATOR_WORKSPACE_ID) {
    return lgpWorkspaceMembers;
  }

  return lgpWorkspaceMembers;
};
