import { Module } from '@nestjs/common';

import { DocumentTrackingController } from 'src/modules/document-tracking/services/document-tracking.controller';
import { DocumentTrackingService } from 'src/modules/document-tracking/services/document-tracking.service';

@Module({
  controllers: [DocumentTrackingController],
  providers: [DocumentTrackingService],
  exports: [DocumentTrackingService],
})
export class DocumentTrackingModule {}
