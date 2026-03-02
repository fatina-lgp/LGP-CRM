import { Module } from '@nestjs/common';

import { GenerateCallSummaryJob } from 'src/modules/discovery-call/jobs/generate-call-summary.job';
import { CallSummaryAgentService } from 'src/modules/discovery-call/services/call-summary-agent.service';
import { DiscoveryCallService } from 'src/modules/discovery-call/services/discovery-call.service';

@Module({
  providers: [
    DiscoveryCallService,
    CallSummaryAgentService,
    GenerateCallSummaryJob,
  ],
  exports: [DiscoveryCallService, CallSummaryAgentService],
})
export class DiscoveryCallModule {}
