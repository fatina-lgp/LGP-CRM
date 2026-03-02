import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DiscoveryCallService {
  private readonly logger = new Logger(DiscoveryCallService.name);

  // Link a calendar event to a lead/opportunity as a discovery call
  async createDiscoveryCall(payload: {
    calendarEventId: string;
    leadId?: string;
    opportunityId?: string;
    callType: string;
    scheduledAt: string;
    ownerId: string;
    workspaceId: string;
  }): Promise<{ discoveryCallId: string }> {
    this.logger.log(
      `Creating discovery call for calendar event ${payload.calendarEventId}`,
    );

    // TODO: Create DiscoveryCall record using Twenty ORM
    const discoveryCallId = crypto.randomUUID();

    this.logger.log(`Discovery call created: ${discoveryCallId}`);

    return { discoveryCallId };
  }

  // Update call status when a calendar event changes
  async onCalendarEventUpdated(payload: {
    calendarEventId: string;
    isCanceled: boolean;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Calendar event updated: ${payload.calendarEventId} (canceled: ${payload.isCanceled})`,
    );

    // TODO: Find DiscoveryCall by calendarEventId using Twenty ORM
    // Update callStatus to CANCELLED if isCanceled is true
  }

  // Mark call as completed and trigger recording fetch + AI summary
  async markCallCompleted(payload: {
    discoveryCallId: string;
    duration: number;
    completedAt: string;
    attendeeCount: number;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Marking discovery call ${payload.discoveryCallId} as completed`,
    );

    // TODO: Update DiscoveryCall record with completion data
    // TODO: Enqueue fetch-call-recording job via BullMQ
    // TODO: Emit workspace event for timeline logging
  }

  // Store recording URL fetched by BullMQ job
  async updateRecordingUrl(payload: {
    discoveryCallId: string;
    recordingUrl: string;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Updating recording URL for discovery call ${payload.discoveryCallId}`,
    );

    // TODO: Update DiscoveryCall.recordingUrl using Twenty ORM
    // TODO: Enqueue generate-call-summary job
  }

  // Store AI-generated summary
  async updateAiSummary(payload: {
    discoveryCallId: string;
    aiSummary: string;
    actionItems: string[];
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Updating AI summary for discovery call ${payload.discoveryCallId}`,
    );

    // TODO: Update DiscoveryCall.aiSummary and actionItems using Twenty ORM
    // TODO: Emit workspace event for timeline logging
  }
}
