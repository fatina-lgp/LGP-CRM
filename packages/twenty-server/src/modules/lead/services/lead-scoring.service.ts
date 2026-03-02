import { Injectable, Logger } from '@nestjs/common';

import {
    type ScoringConfig,
    type ScoringResult,
    DEFAULT_SCORING_CONFIG,
} from 'src/modules/lead/services/lead-scoring.types';

@Injectable()
export class LeadScoringService {
  private readonly logger = new Logger(LeadScoringService.name);
  private config: ScoringConfig;

  constructor() {
    this.config = { ...DEFAULT_SCORING_CONFIG };
  }

  // Score a single lead based on its data
  scoreLead(leadData: {
    companySize?: string | null;
    industry?: string | null;
    annualRevenue?: number | null;
    region?: string | null;
    intakeSource: string;
    lastContactedAt?: string | null;
    timelineActivityCount?: number;
  }): ScoringResult {
    const firmographicScore = this.computeFirmographicScore(leadData);
    const engagementScore = this.computeEngagementScore(
      leadData.timelineActivityCount ?? 0,
    );
    const recencyScore = this.computeRecencyScore(leadData.lastContactedAt);
    const sourceQualityScore = this.computeSourceQualityScore(
      leadData.intakeSource,
    );

    const rawTotal =
      firmographicScore + engagementScore + recencyScore + sourceQualityScore;
    const totalScore = Math.min(rawTotal, this.config.maxScore);

    const engagementLevel = this.determineEngagementLevel(totalScore);

    const notes = this.generateScoringNotes({
      firmographicScore,
      engagementScore,
      recencyScore,
      sourceQualityScore,
      totalScore,
      engagementLevel,
    });

    return {
      totalScore,
      firmographicScore,
      engagementScore,
      recencyScore,
      sourceQualityScore,
      engagementLevel,
      notes,
    };
  }

  // Update scoring configuration at runtime
  updateConfig(partialConfig: Partial<ScoringConfig>): void {
    this.config = { ...this.config, ...partialConfig };
    this.logger.log('Lead scoring configuration updated');
  }

  private computeFirmographicScore(leadData: {
    companySize?: string | null;
    industry?: string | null;
    annualRevenue?: number | null;
    region?: string | null;
  }): number {
    let score = 0;
    const maxFirmographic = 40;

    // Company size score (0-40)
    if (leadData.companySize) {
      score +=
        this.config.firmographic.companySize[leadData.companySize] ??
        this.config.firmographic.companySize['MEDIUM'] ??
        20;
    }

    // Industry relevance bonus (0-10 bonus, capped)
    if (leadData.industry) {
      const industryBonus =
        this.config.firmographic.industryRelevance[leadData.industry] ??
        this.config.firmographic.industryRelevance['DEFAULT'] ??
        10;
      score = Math.min(score + industryBonus, maxFirmographic + 10);
    }

    // Revenue threshold scoring (overrides company size if higher)
    if (leadData.annualRevenue !== null && leadData.annualRevenue !== undefined) {
      const revenueScore = this.config.firmographic.revenueThresholds.find(
        (threshold) =>
          leadData.annualRevenue! >= threshold.min &&
          leadData.annualRevenue! <= threshold.max,
      )?.score;

      if (revenueScore !== undefined) {
        score = Math.max(score, revenueScore);
      }
    }

    return Math.min(score, maxFirmographic);
  }

  private computeEngagementScore(timelineActivityCount: number): number {
    const maxEngagement = 30;

    // Simple engagement scoring based on timeline activity count
    // Each activity contributes diminishing returns
    const baseScore = Math.min(timelineActivityCount * 3, maxEngagement);

    return baseScore;
  }

  private computeRecencyScore(lastContactedAt?: string | null): number {
    const maxRecency = 15;

    if (!lastContactedAt) {
      return 0;
    }

    const daysSinceContact = Math.floor(
      (Date.now() - new Date(lastContactedAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceContact <= 1) {
      return maxRecency;
    }

    // Linear decay over configured window
    const decayFactor = Math.max(
      0,
      1 - daysSinceContact / this.config.recencyDecayDays,
    );

    return Math.round(maxRecency * decayFactor);
  }

  private computeSourceQualityScore(intakeSource: string): number {
    const maxSource = 15;
    const score =
      this.config.sourceQuality[
        intakeSource as keyof typeof this.config.sourceQuality
      ] ?? 5;

    return Math.min(score, maxSource);
  }

  private determineEngagementLevel(
    totalScore: number,
  ): 'COLD' | 'WARM' | 'HOT' {
    if (totalScore >= 70) {
      return 'HOT';
    }

    if (totalScore >= 40) {
      return 'WARM';
    }

    return 'COLD';
  }

  private generateScoringNotes(result: {
    firmographicScore: number;
    engagementScore: number;
    recencyScore: number;
    sourceQualityScore: number;
    totalScore: number;
    engagementLevel: string;
  }): string {
    const parts = [
      `Score: ${result.totalScore}/100`,
      `Firmographic: ${result.firmographicScore}/40`,
      `Engagement: ${result.engagementScore}/30`,
      `Recency: ${result.recencyScore}/15`,
      `Source: ${result.sourceQualityScore}/15`,
      `Level: ${result.engagementLevel}`,
    ];

    return parts.join(' | ');
  }
}
