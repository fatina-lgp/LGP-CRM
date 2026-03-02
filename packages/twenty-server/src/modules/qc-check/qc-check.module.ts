import { Module } from '@nestjs/common';

import { QcCheckService } from 'src/modules/qc-check/services/qc-check.service';

@Module({
  providers: [QcCheckService],
  exports: [QcCheckService],
})
export class QcCheckModule {}
