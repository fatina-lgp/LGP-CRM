import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QcCheckService {
  private readonly logger = new Logger(QcCheckService.name);

  // Record a QC check result
  async recordCheck(payload: {
    opportunityId: string;
    checkName: string;
    status: 'PASSED' | 'FAILED';
    signedOffById: string;
    notes?: string;
    isRequired: boolean;
    workspaceId: string;
  }): Promise<{ qcCheckId: string }> {
    this.logger.log(
      `QC Check: ${payload.checkName} → ${payload.status} for opportunity ${payload.opportunityId}`,
    );

    const qcCheckId = crypto.randomUUID();
    // TODO: Create QcCheck record via Twenty ORM
    // TODO: Check if all required QC checks passed → update qcSignOffComplete
    // TODO: Emit workspace event

    return { qcCheckId };
  }

  // Shipment Block Decision Gate
  async enforceShipmentGate(payload: {
    opportunityId: string;
    targetStage: string;
    workspaceId: string;
  }): Promise<{ allowed: boolean; reason?: string; pendingChecks?: string[] }> {
    if (payload.targetStage !== 'SHIPPING') {
      return { allowed: true };
    }

    // TODO: Query QcChecks where isRequired=true AND opportunityId matches
    // Check if all required checks have status=PASSED
    const pendingChecks = ['Internal QC Sign-Off']; // Placeholder

    if (pendingChecks.length > 0) {
      this.logger.warn(
        `Shipment Gate blocked: ${pendingChecks.length} required QC checks pending`,
      );
      return {
        allowed: false,
        reason: 'All required QC checks must pass before shipping.',
        pendingChecks,
      };
    }

    return { allowed: true };
  }
}
