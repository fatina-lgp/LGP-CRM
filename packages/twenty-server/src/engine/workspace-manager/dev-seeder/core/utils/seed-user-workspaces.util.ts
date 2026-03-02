import { type QueryRunner } from 'typeorm';

import { type UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import {
    SEED_APPLE_WORKSPACE_ID,
    SEED_YCOMBINATOR_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { USER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-users.util';

const tableName = 'userWorkspace';

export const USER_WORKSPACE_DATA_SEED_IDS = {
  MARKETING: '20202020-9e3b-46d4-a556-88b9ddc2b035',
  SALES: '20202020-3957-4908-9c36-2929a23f8353',
  OPS: '20202020-7169-42cf-bc47-1cfef15264b1',
  MARKETING_ACME: '20202020-e10a-4c27-a90b-b08c57b02d44',
  SALES_ACME: '20202020-e10a-4c27-a90b-b08c57b02d45',
  OPS_ACME: '20202020-e10a-4c27-a90b-b08c57b02d46',
  // Legacy aliases
  JANE: '20202020-1e7c-43d9-a5db-685b5069d816',
  TIM: '20202020-9e3b-46d4-a556-88b9ddc2b035',
  JONY: '20202020-3957-4908-9c36-2929a23f8353',
  PHIL: '20202020-7169-42cf-bc47-1cfef15264b1',
  JANE_ACME: '20202020-ae8d-41ea-9469-f74f5d4b002e',
  TIM_ACME: '20202020-e10a-4c27-a90b-b08c57b02d44',
  JONY_ACME: '20202020-e10a-4c27-a90b-b08c57b02d45',
  PHIL_ACME: '20202020-e10a-4c27-a90b-b08c57b02d46',
};

export const RANDOM_USER_WORKSPACE_IDS: Record<string, string> = {};

type SeedUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const seedUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedUserWorkspacesArgs) => {
  let userWorkspaces: Pick<
    UserWorkspaceEntity,
    'id' | 'userId' | 'workspaceId'
  >[] = [];

  if (workspaceId === SEED_APPLE_WORKSPACE_ID) {
    // LGP Alt workspace — add all 3 LGP users
    userWorkspaces = [
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.MARKETING,
        userId: USER_DATA_SEED_IDS.MARKETING,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.SALES,
        userId: USER_DATA_SEED_IDS.SALES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.OPS,
        userId: USER_DATA_SEED_IDS.OPS,
        workspaceId,
      },
    ];
  }

  if (workspaceId === SEED_YCOMBINATOR_WORKSPACE_ID) {
    // LGP QMA primary workspace — add all 3 LGP users
    userWorkspaces = [
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.MARKETING_ACME,
        userId: USER_DATA_SEED_IDS.MARKETING,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.SALES_ACME,
        userId: USER_DATA_SEED_IDS.SALES,
        workspaceId,
      },
      {
        id: USER_WORKSPACE_DATA_SEED_IDS.OPS_ACME,
        userId: USER_DATA_SEED_IDS.OPS,
        workspaceId,
      },
    ];
  }

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, ['id', 'userId', 'workspaceId'])
    .orIgnore()
    .values(userWorkspaces)
    .execute();
};

type DeleteUserWorkspacesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const deleteUserWorkspaces = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: DeleteUserWorkspacesArgs) => {
  await queryRunner.manager
    .createQueryBuilder()
    .delete()
    .from(`${schemaName}.${tableName}`)
    .where(`"${tableName}"."workspaceId" = :workspaceId`, {
      workspaceId,
    })
    .execute();
};
