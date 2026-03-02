import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentTrackingService {
  private readonly logger = new Logger(DocumentTrackingService.name);

  // Record a document tracking event
  async trackEvent(payload: {
    documentName: string;
    documentType: string;
    documentUrl?: string;
    eventType: string;
    leadId?: string;
    opportunityId?: string;
    recipientEmail?: string;
    ipAddress?: string;
    userAgent?: string;
    workspaceId: string;
  }): Promise<{ trackingId: string }> {
    this.logger.log(
      `Tracking event: ${payload.eventType} for "${payload.documentName}" (${payload.documentType})`,
    );

    // TODO: Create DocumentTracking record using Twenty ORM
    const trackingId = crypto.randomUUID();

    // TODO: Emit workspace event for timeline activity on the associated lead
    // TODO: Update lead engagement score via LeadScoringService if lead is associated

    return { trackingId };
  }

  // Generate a unique tracking URL for a document send
  generateTrackingUrl(payload: {
    documentName: string;
    documentType: string;
    documentUrl: string;
    leadId: string;
    recipientEmail: string;
    baseUrl: string;
  }): { trackingPixelUrl: string; trackedDocumentUrl: string } {
    const trackingId = crypto.randomUUID();

    const trackingPixelUrl = `${payload.baseUrl}/api/documents/track/pixel/${trackingId}`;
    const trackedDocumentUrl = `${payload.baseUrl}/api/documents/track/click/${trackingId}?url=${encodeURIComponent(payload.documentUrl)}`;

    this.logger.log(
      `Generated tracking URLs for "${payload.documentName}" to ${payload.recipientEmail}`,
    );

    // TODO: Store tracking ID → metadata mapping for pixel/click resolution

    return { trackingPixelUrl, trackedDocumentUrl };
  }

  // Get engagement stats for a lead
  async getLeadEngagementStats(payload: {
    leadId: string;
    workspaceId: string;
  }): Promise<{
    totalSent: number;
    totalOpened: number;
    totalDownloaded: number;
    openRate: number;
    documents: { name: string; type: string; lastEvent: string; lastEventAt: string }[];
  }> {
    this.logger.log(
      `Fetching engagement stats for lead ${payload.leadId}`,
    );

    // TODO: Query DocumentTracking records by leadId using Twenty ORM
    // TODO: Aggregate event counts and compute open rate

    return {
      totalSent: 0,
      totalOpened: 0,
      totalDownloaded: 0,
      openRate: 0,
      documents: [],
    };
  }
}
