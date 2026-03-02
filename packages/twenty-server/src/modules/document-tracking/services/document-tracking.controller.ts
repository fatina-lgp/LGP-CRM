import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { type Request, type Response } from 'express';

import { DocumentTrackingService } from 'src/modules/document-tracking/services/document-tracking.service';

@Controller('api/documents')
export class DocumentTrackingController {
  private readonly logger = new Logger(DocumentTrackingController.name);

  constructor(
    private readonly documentTrackingService: DocumentTrackingService,
  ) {}

  // Record a tracking event
  @Post('track')
  @HttpCode(HttpStatus.CREATED)
  async trackEvent(
    @Body()
    body: {
      documentName: string;
      documentType: string;
      documentUrl?: string;
      eventType: string;
      leadId?: string;
      opportunityId?: string;
      recipientEmail?: string;
    },
    @Req() request: Request,
  ) {
    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const result = await this.documentTrackingService.trackEvent({
      ...body,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      workspaceId,
    });

    return { success: true, data: result };
  }

  // Tracking pixel endpoint — returns 1x1 transparent GIF
  @Get('track/pixel/:trackingId')
  async trackPixel(
    @Param('trackingId') trackingId: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    this.logger.log(`Tracking pixel hit: ${trackingId}`);

    // TODO: Extract workspaceId from tracking ID metadata
    const workspaceId = 'default-workspace';

    // Record the open event
    await this.documentTrackingService.trackEvent({
      documentName: 'Resolved from tracking ID',
      documentType: 'UNKNOWN',
      eventType: 'OPENED',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      workspaceId,
    });

    // Return 1x1 transparent GIF
    const transparentGif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64',
    );

    response.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': transparentGif.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
    response.end(transparentGif);
  }

  // Get engagement stats for a lead
  @Get(':leadId/engagement')
  async getEngagementStats(@Param('leadId') leadId: string) {
    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const stats = await this.documentTrackingService.getLeadEngagementStats({
      leadId,
      workspaceId,
    });

    return { success: true, data: stats };
  }
}
