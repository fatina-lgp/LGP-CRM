import { Scope } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { CallSummaryAgentService } from 'src/modules/discovery-call/services/call-summary-agent.service';
import { DiscoveryCallService } from 'src/modules/discovery-call/services/discovery-call.service';

export type GenerateCallSummaryJobData = {
  discoveryCallId: string;
  recordingUrl?: string;
  transcript?: string;
  workspaceId: string;
};

@Processor({
  queueName: MessageQueue.aiQueue,
  scope: Scope.REQUEST,
})
export class GenerateCallSummaryJob {
  constructor(
    private readonly callSummaryAgentService: CallSummaryAgentService,
    private readonly discoveryCallService: DiscoveryCallService,
  ) {}

  @Process(GenerateCallSummaryJob.name)
  async handle(data: GenerateCallSummaryJobData): Promise<void> {
    const { discoveryCallId, recordingUrl, transcript, workspaceId } = data;

    const result = await this.callSummaryAgentService.generateSummary({
      discoveryCallId,
      recordingUrl,
      transcript,
      workspaceId,
    });

    await this.discoveryCallService.updateAiSummary({
      discoveryCallId,
      aiSummary: result.summary,
      actionItems: result.actionItems,
      workspaceId,
    });
  }
}
