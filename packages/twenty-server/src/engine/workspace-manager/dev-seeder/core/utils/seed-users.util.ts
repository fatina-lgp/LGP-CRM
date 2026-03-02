import { type QueryRunner } from 'typeorm';

const tableName = 'user';

export const USER_DATA_SEED_IDS = {
  MARKETING: 'a0a10001-0001-4000-8000-000000000001',
  SALES: 'a0a10001-0002-4000-8000-000000000002',
  OPS: 'a0a10001-0003-4000-8000-000000000003',
  // Keep JONY/PHIL/JANE/TIM aliases pointing to LGP users for code compat
  JANE: 'a0a10001-0001-4000-8000-000000000001',
  TIM: 'a0a10001-0001-4000-8000-000000000001',
  JONY: 'a0a10001-0002-4000-8000-000000000002',
  PHIL: 'a0a10001-0003-4000-8000-000000000003',
};

export const RANDOM_USER_IDS: Record<string, string> = {};

type SeedUsersArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
};

export const seedUsers = async ({ queryRunner, schemaName }: SeedUsersArgs) => {
  const lgpUsers = [
    {
      id: USER_DATA_SEED_IDS.MARKETING,
      firstName: 'Marketing',
      lastName: 'LGP',
      email: 'marketing@lgphub.com',
      // LGPhub2025!
      passwordHash:
        '$2b$10$mUNq9bVlJdWkdhyyISwvQenx3zaqeMmII0MBDAK/msvSkuv/7Q7eW',
      canImpersonate: true,
      canAccessFullAdminPanel: true,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.SALES,
      firstName: 'Sales',
      lastName: 'LGP',
      email: 'sales@lgphub.com',
      // LGPhub2025!
      passwordHash:
        '$2b$10$mUNq9bVlJdWkdhyyISwvQenx3zaqeMmII0MBDAK/msvSkuv/7Q7eW',
      canImpersonate: false,
      canAccessFullAdminPanel: false,
      isEmailVerified: true,
    },
    {
      id: USER_DATA_SEED_IDS.OPS,
      firstName: 'Ops',
      lastName: 'LGP',
      email: 'ops@lgphub.com',
      // LGPhub2025!
      passwordHash:
        '$2b$10$mUNq9bVlJdWkdhyyISwvQenx3zaqeMmII0MBDAK/msvSkuv/7Q7eW',
      canImpersonate: false,
      canAccessFullAdminPanel: false,
      isEmailVerified: true,
    },
  ];

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'canImpersonate',
      'canAccessFullAdminPanel',
      'isEmailVerified',
    ])
    .orIgnore()
    .values(lgpUsers)
    .execute();
};
