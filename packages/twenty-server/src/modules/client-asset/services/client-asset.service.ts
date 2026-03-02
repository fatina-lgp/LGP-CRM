import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClientAssetService {
  private readonly logger = new Logger(ClientAssetService.name);

  // Record a client asset upload
  async recordAssetUpload(payload: {
    opportunityId: string;
    leadId?: string;
    fileName: string;
    fileUrl: string;
    fileType: 'LOGO' | 'BRAND_GUIDE' | 'IMAGE' | 'DOCUMENT';
    uploadedBy: string;
    workspaceId: string;
  }): Promise<{
    assetId: string;
    approvalDeadline: string;
  }> {
    this.logger.log(`Asset uploaded: ${payload.fileName} (${payload.fileType})`);

    const assetId = crypto.randomUUID();

    // Calculate 3 business days from now for auto-approval deadline
    const approvalDeadline = this.addBusinessDays(new Date(), 3);

    // TODO: Create ClientAsset record via Twenty ORM
    // TODO: Emit workspace event for timeline logging
    // TODO: Enqueue silence-approval check job via BullMQ

    return {
      assetId,
      approvalDeadline: approvalDeadline.toISOString(),
    };
  }

  // Approve or reject an asset
  async updateAssetStatus(payload: {
    assetId: string;
    status: 'APPROVED' | 'REJECTED';
    autoApproved?: boolean;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Asset ${payload.assetId} → ${payload.status}${payload.autoApproved ? ' (auto)' : ''}`,
    );

    // TODO: Update ClientAsset record via Twenty ORM
    // TODO: Emit workspace event
  }

  // Check all pending assets and auto-approve if deadline has passed
  async processAutoApprovals(workspaceId: string): Promise<{
    autoApproved: number;
  }> {
    this.logger.log('Processing auto-approvals (Silence = Approval)');

    // TODO: Query ClientAssets where:
    //   - status = 'UNDER_REVIEW'
    //   - approvalDeadline < NOW()
    //   - autoApproved = false
    // For each, set status = 'APPROVED', autoApproved = true

    return { autoApproved: 0 };
  }

  // Add N business days to a date (skip weekends)
  private addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let added = 0;

    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }

    return result;
  }
}
