import { Module } from '@nestjs/common';

import { ReportGeneratorService } from 'src/modules/analytics-report/services/report-generator.service';

@Module({
  providers: [ReportGeneratorService],
  exports: [ReportGeneratorService],
})
export class AnalyticsReportModule {}
