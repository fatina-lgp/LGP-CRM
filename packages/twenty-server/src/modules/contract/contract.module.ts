import { Module } from '@nestjs/common';

import { ContractService } from 'src/modules/contract/services/contract.service';
import { DepositTrackerService } from 'src/modules/contract/services/deposit-tracker.service';
import { EsignatureWebhookController } from 'src/modules/contract/services/esignature-webhook.controller';

@Module({
  controllers: [EsignatureWebhookController],
  providers: [ContractService, DepositTrackerService],
  exports: [ContractService, DepositTrackerService],
})
export class ContractModule {}
