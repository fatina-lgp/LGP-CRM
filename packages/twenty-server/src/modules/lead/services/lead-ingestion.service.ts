import { Injectable, Logger } from '@nestjs/common';

import { LeadScoringService } from 'src/modules/lead/services/lead-scoring.service';
import {
    type BatchIngestionResult,
    type LeadIngestionPayload,
    type LeadIngestionResult,
} from 'src/modules/lead/services/lead-scoring.types';

@Injectable()
export class LeadIngestionService {
  private readonly logger = new Logger(LeadIngestionService.name);

  constructor(private readonly leadScoringService: LeadScoringService) {}

  // Ingest a single lead
  async ingestLead(
    payload: LeadIngestionPayload,
    workspaceId: string,
  ): Promise<LeadIngestionResult> {
    this.logger.log(
      `Ingesting lead: ${payload.firstName} ${payload.lastName} (${payload.email})`,
    );

    // Normalize the email for deduplication
    const normalizedEmail = payload.email.trim().toLowerCase();

    // TODO: Check for existing lead by email using Twenty ORM
    // const existingLead = await this.leadRepository.findByEmail(normalizedEmail, workspaceId);

    // Score the lead based on available data
    const scoringResult = this.leadScoringService.scoreLead({
      companySize: payload.companySize,
      industry: payload.industry,
      annualRevenue: payload.annualRevenue,
      region: payload.region,
      intakeSource: payload.intakeSource,
      lastContactedAt: null,
      timelineActivityCount: 0,
    });

    // TODO: Create or update lead record using Twenty ORM
    // For now, return a placeholder result
    const leadId = crypto.randomUUID();

    this.logger.log(
      `Lead ingested: ${leadId} | Score: ${scoringResult.totalScore} | Level: ${scoringResult.engagementLevel}`,
    );

    // TODO: Emit workspace event for timeline activity logging
    // this.workspaceEventEmitter.emit('lead.created', { leadId, workspaceId });

    return {
      leadId,
      isNew: true,
      leadScore: scoringResult.totalScore,
      engagementLevel: scoringResult.engagementLevel,
    };
  }

  // Batch ingest leads (for scraping tool webhooks, CSV imports)
  async ingestBatch(
    payloads: LeadIngestionPayload[],
    workspaceId: string,
  ): Promise<BatchIngestionResult> {
    this.logger.log(`Batch ingesting ${payloads.length} leads`);

    const results: LeadIngestionResult[] = [];
    const errors: { index: number; error: string }[] = [];
    let created = 0;
    let updated = 0;

    for (let i = 0; i < payloads.length; i++) {
      try {
        const result = await this.ingestLead(payloads[i], workspaceId);

        results.push(result);

        if (result.isNew) {
          created++;
        } else {
          updated++;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        this.logger.error(
          `Error ingesting lead at index ${i}: ${errorMessage}`,
        );
        errors.push({ index: i, error: errorMessage });
      }
    }

    this.logger.log(
      `Batch ingestion complete: ${created} created, ${updated} updated, ${errors.length} errors`,
    );

    return {
      total: payloads.length,
      created,
      updated,
      errors,
      results,
    };
  }
}
