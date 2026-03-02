import { Scope } from '@nestjs/common';

import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { ClientAssetService } from 'src/modules/client-asset/services/client-asset.service';

export type SilenceApprovalJobData = {
  workspaceId: string;
};

@Processor({
  queueName: MessageQueue.cronQueue,
  scope: Scope.REQUEST,
})
export class SilenceApprovalJob {
  constructor(
    private readonly clientAssetService: ClientAssetService,
  ) {}

  @Process(SilenceApprovalJob.name)
  async handle(data: SilenceApprovalJobData): Promise<void> {
    const { workspaceId } = data;

    const result = await this.clientAssetService.processAutoApprovals(
      workspaceId,
    );

    if (result.autoApproved > 0) {
      // Log auto-approvals for audit trail
    }
  }
}
