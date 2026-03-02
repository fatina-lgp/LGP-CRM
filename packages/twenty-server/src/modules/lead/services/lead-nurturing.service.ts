import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LeadNurturingService {
  private readonly logger = new Logger(LeadNurturingService.name);

  // Handle lead status change events
  async onLeadStatusChanged(payload: {
    leadId: string;
    previousStatus: string;
    newStatus: string;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Lead ${payload.leadId} status changed: ${payload.previousStatus} -> ${payload.newStatus}`,
    );

    switch (payload.newStatus) {
      case 'CONTACTED':
        await this.enrollInOutreachSequence(payload.leadId, payload.workspaceId);
        break;
      case 'QUALIFIED':
        await this.notifyOwnerOfQualifiedLead(
          payload.leadId,
          payload.workspaceId,
        );
        break;
      case 'CONVERTED':
        await this.handleConversion(payload.leadId, payload.workspaceId);
        break;
      default:
        break;
    }
  }

  // Handle new lead scored event — trigger initial outreach if score is high enough
  async onLeadScored(payload: {
    leadId: string;
    leadScore: number;
    engagementLevel: string;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Lead ${payload.leadId} scored: ${payload.leadScore} (${payload.engagementLevel})`,
    );

    if (payload.engagementLevel === 'HOT') {
      this.logger.log(
        `Hot lead detected: ${payload.leadId} — triggering priority outreach`,
      );
      // TODO: Integrate with Twenty's workflow engine to trigger priority outreach
      // This will be connected to email/SMS automation in Phase 2
    }
  }

  private async enrollInOutreachSequence(
    leadId: string,
    workspaceId: string,
  ): Promise<void> {
    this.logger.log(
      `Enrolling lead ${leadId} in outreach sequence (workspace: ${workspaceId})`,
    );

    // TODO: Integration points for outreach automation:
    // 1. Trigger email sequence via Twenty's workflow engine
    // 2. Schedule SMS follow-up via configured SMS provider
    // 3. Create follow-up task assigned to lead owner
    // These integrations will be connected in Phase 2 (Discovery Call)
  }

  private async notifyOwnerOfQualifiedLead(
    leadId: string,
    workspaceId: string,
  ): Promise<void> {
    this.logger.log(
      `Notifying owner of qualified lead ${leadId} (workspace: ${workspaceId})`,
    );

    // TODO: Send notification to lead owner via:
    // 1. In-app notification
    // 2. Email notification
    // 3. Create priority task for discovery call scheduling
  }

  private async handleConversion(
    leadId: string,
    workspaceId: string,
  ): Promise<void> {
    this.logger.log(
      `Handling conversion for lead ${leadId} (workspace: ${workspaceId})`,
    );

    // TODO: Conversion workflow:
    // 1. Create Opportunity record linked to lead's company
    // 2. Move lead to "Converted" status
    // 3. Log timeline activity
    // 4. Trigger Phase 2 (Discovery Call) workflow
  }
}
