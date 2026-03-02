import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IntakeQualifierService {
  private readonly logger = new Logger(IntakeQualifierService.name);

  // Required fields that must be filled for the intake form to be "complete"
  private readonly requiredFields = ['budgetOwner', 'headcount'] as const;

  // Submit or update the intake qualifier form
  async submitForm(payload: {
    leadId: string;
    opportunityId?: string;
    budgetOwner?: string;
    budgetAmount?: number;
    budgetAmountCurrency?: string;
    headcount?: number;
    decisionTimeline?: string;
    currentSolution?: string;
    painPoints?: string;
    eventDate?: string;
    tier?: string;
    submittedById: string;
    workspaceId: string;
  }): Promise<{
    qualifierId: string;
    isComplete: boolean;
    missingFields: string[];
  }> {
    this.logger.log(
      `Submitting intake qualifier for lead ${payload.leadId}`,
    );

    // Validate and determine completeness
    const missingFields = this.getMissingRequiredFields(payload);
    const isComplete = missingFields.length === 0;

    // TODO: Create or update IntakeQualifier record using Twenty ORM
    const qualifierId = crypto.randomUUID();

    if (isComplete) {
      this.logger.log(
        `Intake qualifier complete for lead ${payload.leadId} — stage advancement unblocked`,
      );
      // TODO: Emit workspace event for timeline logging
      // TODO: Notify lead owner that qualification is complete
    } else {
      this.logger.log(
        `Intake qualifier incomplete for lead ${payload.leadId} — missing: ${missingFields.join(', ')}`,
      );
    }

    return { qualifierId, isComplete, missingFields };
  }

  // Check if a lead's intake qualifier is complete (Decision Gate check)
  async isQualificationComplete(payload: {
    leadId: string;
    workspaceId: string;
  }): Promise<{
    isComplete: boolean;
    missingFields: string[];
    qualifierId: string | null;
  }> {
    this.logger.log(
      `Checking qualification completeness for lead ${payload.leadId}`,
    );

    // TODO: Query IntakeQualifier by leadId using Twenty ORM

    return {
      isComplete: false,
      missingFields: [...this.requiredFields],
      qualifierId: null,
    };
  }

  // Enforce the Decision Gate — blocks stage advancement if incomplete
  async enforceDecisionGate(payload: {
    leadId: string;
    targetStatus: string;
    workspaceId: string;
  }): Promise<{
    allowed: boolean;
    reason?: string;
    missingFields?: string[];
  }> {
    // Only gate advancement to QUALIFIED status
    if (payload.targetStatus !== 'QUALIFIED') {
      return { allowed: true };
    }

    const qualification = await this.isQualificationComplete({
      leadId: payload.leadId,
      workspaceId: payload.workspaceId,
    });

    if (!qualification.isComplete) {
      this.logger.warn(
        `Decision Gate blocked: Lead ${payload.leadId} cannot advance to QUALIFIED — missing: ${qualification.missingFields.join(', ')}`,
      );

      return {
        allowed: false,
        reason:
          'Intake Qualifier form must be completed before advancing to Qualified status.',
        missingFields: qualification.missingFields,
      };
    }

    return { allowed: true };
  }

  // Get the intake qualifier for a lead
  async getByLeadId(payload: {
    leadId: string;
    workspaceId: string;
  }): Promise<Record<string, unknown> | null> {
    this.logger.log(
      `Fetching intake qualifier for lead ${payload.leadId}`,
    );

    // TODO: Query IntakeQualifier by leadId using Twenty ORM

    return null;
  }

  private getMissingRequiredFields(
    data: Record<string, unknown>,
  ): string[] {
    const missing: string[] = [];

    for (const field of this.requiredFields) {
      const value = data[field];

      if (value === null || value === undefined || value === '') {
        missing.push(field);
      }
    }

    return missing;
  }
}
