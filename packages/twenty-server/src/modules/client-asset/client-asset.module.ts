import { Module } from '@nestjs/common';

import { SilenceApprovalJob } from 'src/modules/client-asset/jobs/silence-approval.job';
import { ClientAssetService } from 'src/modules/client-asset/services/client-asset.service';

@Module({
  providers: [ClientAssetService, SilenceApprovalJob],
  exports: [ClientAssetService],
})
export class ClientAssetModule {}
