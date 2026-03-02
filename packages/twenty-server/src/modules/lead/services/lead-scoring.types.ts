// Scoring weight configuration types for the Lead Scoring Model

export type FirmographicScoringWeights = {
  companySize: Record<string, number>;
  industryRelevance: Record<string, number>;
  revenueThresholds: { min: number; max: number; score: number }[];
  regionWeights: Record<string, number>;
};

export type EngagementScoringWeights = {
  emailOpened: number;
  emailClicked: number;
  formFilled: number;
  documentDownloaded: number;
  websiteVisited: number;
  meetingScheduled: number;
};

export type SourceQualityWeights = {
  SCRAPED: number;
  MANUAL: number;
  IMPORT: number;
  REFERRAL: number;
  WEBSITE: number;
  API: number;
};

export type ScoringConfig = {
  firmographic: FirmographicScoringWeights;
  engagement: EngagementScoringWeights;
  sourceQuality: SourceQualityWeights;
  recencyDecayDays: number;
  maxScore: number;
};

export type ScoringResult = {
  totalScore: number;
  firmographicScore: number;
  engagementScore: number;
  recencyScore: number;
  sourceQualityScore: number;
  engagementLevel: 'COLD' | 'WARM' | 'HOT';
  notes: string;
};

export type LeadIngestionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  annualRevenue?: number;
  annualRevenueCurrency?: string;
  region?: string;
  intakeSource: string;
  intakeSourceDetail?: string;
};

export type LeadIngestionResult = {
  leadId: string;
  isNew: boolean;
  leadScore: number;
  engagementLevel: string;
};

export type BatchIngestionResult = {
  total: number;
  created: number;
  updated: number;
  errors: { index: number; error: string }[];
  results: LeadIngestionResult[];
};

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  firmographic: {
    companySize: {
      MICRO: 5,
      SMALL: 10,
      MEDIUM: 20,
      LARGE: 30,
      ENTERPRISE: 40,
    },
    industryRelevance: {
      // LGP-specific industry weights — customize as needed
      DEFAULT: 10,
    },
    revenueThresholds: [
      { min: 0, max: 100000, score: 5 },
      { min: 100001, max: 500000, score: 15 },
      { min: 500001, max: 2000000, score: 25 },
      { min: 2000001, max: Infinity, score: 40 },
    ],
    regionWeights: {
      DEFAULT: 10,
    },
  },
  engagement: {
    emailOpened: 3,
    emailClicked: 5,
    formFilled: 10,
    documentDownloaded: 8,
    websiteVisited: 2,
    meetingScheduled: 15,
  },
  sourceQuality: {
    SCRAPED: 5,
    MANUAL: 10,
    IMPORT: 7,
    REFERRAL: 15,
    WEBSITE: 8,
    API: 6,
  },
  recencyDecayDays: 30,
  maxScore: 100,
};
