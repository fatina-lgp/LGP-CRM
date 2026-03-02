import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
} from '@nestjs/common';

import {
    BatchIngestLeadDto,
    IngestLeadDto,
} from 'src/modules/lead/services/lead-ingestion.dto';
import { LeadIngestionService } from 'src/modules/lead/services/lead-ingestion.service';

@Controller('api/leads')
export class LeadIngestionController {
  private readonly logger = new Logger(LeadIngestionController.name);

  constructor(
    private readonly leadIngestionService: LeadIngestionService,
  ) {}

  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
  async ingestSingleLead(@Body() dto: IngestLeadDto) {
    this.logger.log(`Single lead ingestion request: ${dto.email}`);

    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const result = await this.leadIngestionService.ingestLead(
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        jobTitle: dto.jobTitle,
        linkedinUrl: dto.linkedinUrl,
        companyName: dto.companyName,
        industry: dto.industry,
        companySize: dto.companySize,
        annualRevenue: dto.annualRevenue,
        annualRevenueCurrency: dto.annualRevenueCurrency,
        region: dto.region,
        intakeSource: dto.intakeSource,
        intakeSourceDetail: dto.intakeSourceDetail,
      },
      workspaceId,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Post('ingest/batch')
  @HttpCode(HttpStatus.CREATED)
  async ingestBatchLeads(@Body() dto: BatchIngestLeadDto) {
    this.logger.log(`Batch lead ingestion request: ${dto.leads.length} leads`);

    // TODO: Extract workspaceId from authenticated request context
    const workspaceId = 'default-workspace';

    const payloads = dto.leads.map((lead) => ({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      jobTitle: lead.jobTitle,
      linkedinUrl: lead.linkedinUrl,
      companyName: lead.companyName,
      industry: lead.industry,
      companySize: lead.companySize,
      annualRevenue: lead.annualRevenue,
      annualRevenueCurrency: lead.annualRevenueCurrency,
      region: lead.region,
      intakeSource: lead.intakeSource,
      intakeSourceDetail: lead.intakeSourceDetail,
    }));

    const result = await this.leadIngestionService.ingestBatch(
      payloads,
      workspaceId,
    );

    return {
      success: true,
      data: result,
    };
  }
}
