import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OpportunityClonerService {
  private readonly logger = new Logger(OpportunityClonerService.name);

  // Clone an opportunity for next quarter's renewal
  async cloneForRenewal(payload: {
    sourceOpportunityId: string;
    renewalQuarter: string;
    workspaceId: string;
  }): Promise<{
    newOpportunityId: string;
    followUpTaskId: string;
  }> {
    this.logger.log(
      `Cloning opportunity ${payload.sourceOpportunityId} for ${payload.renewalQuarter}`,
    );

    // TODO: Fetch source Opportunity via Twenty ORM
    // TODO: Clone with new ID, reset status, set renewalQuarter
    // TODO: Set clonedFrom relation
    // TODO: Create follow-up task for salesperson (30 days out)

    const newOpportunityId = crypto.randomUUID();
    const followUpTaskId = crypto.randomUUID();

    this.logger.log(
      `Renewal opportunity ${newOpportunityId} created with follow-up task ${followUpTaskId}`,
    );

    return { newOpportunityId, followUpTaskId };
  }
}
