import { isDefined } from 'twenty-shared/utils';

import { COMPANY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/company-data-seeds.constant';
import { PERSON_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/person-data-seeds.constant';
import {
    WORKSPACE_MEMBER_DATA_SEED_IDS,
    WORKSPACE_MEMBER_DATA_SEEDS,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type OpportunityDataSeed = {
  id: string;
  name: string;
  amountAmountMicros: number;
  amountCurrencyCode: string;
  closeDate: Date;
  stage: string;
  position: number;
  pointOfContactId: string;
  companyId: string;
  ownerId: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
};

export const OPPORTUNITY_DATA_SEED_COLUMNS: (keyof OpportunityDataSeed)[] = [
  'id',
  'name',
  'amountAmountMicros',
  'amountCurrencyCode',
  'closeDate',
  'stage',
  'position',
  'pointOfContactId',
  'companyId',
  'ownerId',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
];

const GENERATE_OPPORTUNITY_IDS = (): Record<string, string> => {
  const OPPORTUNITY_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 50; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    OPPORTUNITY_IDS[`ID_${INDEX}`] =
      `50505050-${HEX_INDEX}-4e7c-8001-123456789abc`;
  }

  return OPPORTUNITY_IDS;
};

export const OPPORTUNITY_DATA_SEED_IDS = GENERATE_OPPORTUNITY_IDS();

// LGP QMA Opportunity names - promo, print, and swag deals
const OPPORTUNITY_TEMPLATES = [
  { name: 'Branded Polo Shirts - Q1 Activation', amount: 45000, stage: 'NEW' },
  { name: 'Trade Show Booth Package - Expo 2025', amount: 185000, stage: 'CONTACTED' },
  { name: 'Custom Drinkware Kit - Summer Campaign', amount: 28000, stage: 'DISCOVERY_CALL_BOOKED' },
  { name: 'Promotional Tote Bags - Conference Bundle', amount: 32000, stage: 'DISCOVERY_CALL_COMPLETED' },
  { name: 'Executive Gift Set - Q4 Holiday', amount: 94000, stage: 'INTAKE_COMPLETED' },
  { name: 'Employee Onboarding Swag Pack', amount: 67000, stage: 'PROPOSAL' },
  { name: 'Logo Apparel - Corporate Uniform Refresh', amount: 120000, stage: 'NEGOTIATIONS' },
  { name: 'Direct Mail Print Campaign - 50k Units', amount: 78000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Custom USB Drives - Tech Event Giveaway', amount: 18500, stage: 'NEW' },
  { name: 'Branded Notebooks & Pens - Annual Summit', amount: 24000, stage: 'CONTACTED' },
  { name: 'Pop-Up Banners & Signage Package', amount: 41000, stage: 'DISCOVERY_CALL_BOOKED' },
  { name: 'Custom Branded Hats - Outdoor Promo', amount: 35000, stage: 'INTAKE_COMPLETED' },
  { name: 'Yard Signs & Door Hangers - Local Campaign', amount: 12000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Promotional Power Banks - Tech Launch', amount: 52000, stage: 'PROPOSAL' },
  { name: 'Branded Lanyards & Badge Holders', amount: 9500, stage: 'CONTACTED' },
  { name: 'Vinyl Banner Set - Grand Opening', amount: 16000, stage: 'NEW' },
  { name: 'Custom Logo Mugs - Customer Appreciation', amount: 21000, stage: 'DISCOVERY_CALL_COMPLETED' },
  { name: 'Fleece Jackets - Team Activation Kit', amount: 88000, stage: 'NEGOTIATIONS' },
  { name: 'Branded Backpacks - Annual Convention', amount: 110000, stage: 'PROPOSAL' },
  { name: 'Custom Calendars - Year-Round Promo', amount: 19000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Embroidered Caps - Sports Sponsorship', amount: 43000, stage: 'INTAKE_COMPLETED' },
  { name: 'Promotional Keychains - Dealer Event', amount: 7500, stage: 'CONTACTED' },
  { name: 'Custom Branded Coolers - Summer Swag', amount: 74000, stage: 'NEW' },
  { name: 'Tradeshow Giveaway Package 2025', amount: 65000, stage: 'PROPOSAL' },
  { name: 'Branded Water Bottles - Wellness Program', amount: 38000, stage: 'DISCOVERY_CALL_BOOKED' },
  { name: 'Custom Patches & Pins - Collector Edition', amount: 14000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Fleece Blankets - Customer Loyalty Gift', amount: 56000, stage: 'INTAKE_COMPLETED' },
  { name: 'Logo Embroidered Hats Bulk Order', amount: 29000, stage: 'CONTACTED' },
  { name: 'Custom Stickers & Decals - Brand Awareness', amount: 8500, stage: 'DISCOVERY_CALL_COMPLETED' },
  { name: 'QMA Full Activation Package', amount: 215000, stage: 'NEGOTIATIONS' },
  { name: 'Holiday Gift Box - VIP Client Set', amount: 135000, stage: 'PROPOSAL' },
  { name: 'Digital Print Collateral - Product Launch', amount: 47000, stage: 'CONTACTED' },
  { name: 'Branded Face Masks & PPE Kit', amount: 22000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Custom Phone Cases - Brand Merch Store', amount: 33000, stage: 'NEW' },
  { name: 'Team Jersey Program - Sports Activation', amount: 92000, stage: 'DISCOVERY_CALL_BOOKED' },
  { name: 'Laser-Engraved Awards & Plaques', amount: 41000, stage: 'INTAKE_COMPLETED' },
  { name: 'Pop Socket & Tech Accessories Bundle', amount: 26000, stage: 'CONTACTED' },
  { name: 'Custom Print Folders - Sales Package', amount: 18000, stage: 'NEW' },
  { name: 'Branded Speakers & Headphones - Premium Swag', amount: 145000, stage: 'NEGOTIATIONS' },
  { name: 'Anniversary Kit - 10 Year Celebration', amount: 87000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Seasonal Candy & Snack Gift Sets', amount: 31000, stage: 'PROPOSAL' },
  { name: 'Custom Sunglasses - Outdoor Event', amount: 16500, stage: 'DISCOVERY_CALL_COMPLETED' },
  { name: 'Branded Umbrellas - Weather Activation', amount: 42000, stage: 'CONTACTED' },
  { name: 'Multi-Color Screen Print Tee Order', amount: 58000, stage: 'DISCOVERY_CALL_BOOKED' },
  { name: 'Logo Canvas Print - Office Decor Kit', amount: 23000, stage: 'NEW' },
  { name: 'Custom Tumblers - Restaurant Partner Deal', amount: 48000, stage: 'CONTRACT_AND_PAYMENT' },
  { name: 'Foam Koozies Promotional Bulk Run', amount: 6500, stage: 'CONTACTED' },
  { name: 'Branded Tablet Sleeves - Tech Partner', amount: 37000, stage: 'INTAKE_COMPLETED' },
  { name: 'Premium Branded Gift Bags - Gala Event', amount: 72000, stage: 'NEGOTIATIONS' },
  { name: 'QMA Renewal - Full Year Activation', amount: 320000, stage: 'CONTRACT_AND_PAYMENT' },
];

const GENERATE_OPPORTUNITY_SEEDS = (): OpportunityDataSeed[] => {
  const OPPORTUNITY_SEEDS: OpportunityDataSeed[] = [];

  for (let INDEX = 1; INDEX <= 50; INDEX++) {
    const TEMPLATE_INDEX = (INDEX - 1) % OPPORTUNITY_TEMPLATES.length;
    const TEMPLATE = OPPORTUNITY_TEMPLATES[TEMPLATE_INDEX];

    const DAYS_AHEAD = Math.floor(Math.random() * 90) + 1;
    const CLOSE_DATE = new Date();

    CLOSE_DATE.setDate(CLOSE_DATE.getDate() + DAYS_AHEAD);

    const workspaceMemberId = Object.values(WORKSPACE_MEMBER_DATA_SEED_IDS)[
      INDEX % 4
    ];
    const workspaceMember = WORKSPACE_MEMBER_DATA_SEEDS.find(
      (workspaceMember) => workspaceMember.id === workspaceMemberId,
    );
    const workspaceMemberName = isDefined(workspaceMember)
      ? `${workspaceMember?.nameFirstName} ${workspaceMember?.nameLastName}`
      : 'Unkonwn';

    const rawSeed: OpportunityDataSeed = {
      id: OPPORTUNITY_DATA_SEED_IDS[`ID_${INDEX}`],
      name: TEMPLATE.name,
      amountAmountMicros: TEMPLATE.amount * 1000000,
      amountCurrencyCode: 'USD',
      closeDate: CLOSE_DATE,
      stage: TEMPLATE.stage,
      position: INDEX,
      pointOfContactId:
        PERSON_DATA_SEED_IDS[
          `ID_${INDEX}` as keyof typeof PERSON_DATA_SEED_IDS
        ] || PERSON_DATA_SEED_IDS.ID_1,
      companyId:
        COMPANY_DATA_SEED_IDS[
          `ID_${Math.ceil(INDEX / 2)}` as keyof typeof COMPANY_DATA_SEED_IDS
        ] || COMPANY_DATA_SEED_IDS.ID_1,
      ownerId: WORKSPACE_MEMBER_DATA_SEED_IDS.TIM,
      createdBySource: 'MANUAL',
      updatedBySource: 'MANUAL',
      createdByWorkspaceMemberId: workspaceMemberId,
      createdByName: workspaceMemberName,
      updatedByWorkspaceMemberId: workspaceMemberId,
      updatedByName: workspaceMemberName,
    };

    const opportunityDataSeedWithSQLColumnOrder: OpportunityDataSeed =
      Object.fromEntries(
        OPPORTUNITY_DATA_SEED_COLUMNS.map((column) => [
          column,
          rawSeed[column as keyof OpportunityDataSeed],
        ]),
      ) as OpportunityDataSeed;

    OPPORTUNITY_SEEDS.push(opportunityDataSeedWithSQLColumnOrder);
  }

  return OPPORTUNITY_SEEDS;
};

export const OPPORTUNITY_DATA_SEEDS = GENERATE_OPPORTUNITY_SEEDS();
