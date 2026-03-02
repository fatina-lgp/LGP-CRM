import { Module } from '@nestjs/common';

import { LeadIngestionController } from 'src/modules/lead/services/lead-ingestion.controller';
import { LeadIngestionService } from 'src/modules/lead/services/lead-ingestion.service';
import { LeadNurturingService } from 'src/modules/lead/services/lead-nurturing.service';
import { LeadScoringService } from 'src/modules/lead/services/lead-scoring.service';

@Module({
  controllers: [LeadIngestionController],
  providers: [LeadScoringService, LeadIngestionService, LeadNurturingService],
  exports: [LeadScoringService, LeadIngestionService, LeadNurturingService],
})
export class LeadModule {}
