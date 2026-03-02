import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DepositTrackerService {
  private readonly logger = new Logger(DepositTrackerService.name);

  // Update deposit status on an opportunity
  async updateDepositStatus(payload: {
    opportunityId: string;
    depositStatus: 'PENDING' | 'PARTIAL' | 'CLEARED' | 'REFUNDED';
    depositAmount?: number;
    depositCurrency?: string;
    workspaceId: string;
  }): Promise<{ productionBlocked: boolean }> {
    this.logger.log(
      `Deposit update for opportunity ${payload.opportunityId}: ${payload.depositStatus}`,
    );

    const productionBlocked = payload.depositStatus !== 'CLEARED';

    // TODO: Update Opportunity record via Twenty ORM:
    //   - depositStatus
    //   - depositAmount
    //   - depositClearedAt (if CLEARED)
    //   - productionBlocked

    if (!productionBlocked) {
      this.logger.log(
        `Deposit cleared for opportunity ${payload.opportunityId} — Production Block released`,
      );
      // TODO: Trigger Kickoff Confirmation email (Email 3) via BullMQ
      // TODO: Emit workspace event for timeline logging
    }

    return { productionBlocked };
  }

  // Production Block Decision Gate — check if opportunity can advance
  async enforceProductionGate(payload: {
    opportunityId: string;
    targetStage: string;
    workspaceId: string;
  }): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    // Only gate advancement to PRODUCTION stage
    if (payload.targetStage !== 'PRODUCTION') {
      return { allowed: true };
    }

    // TODO: Look up Opportunity.depositStatus via Twenty ORM
    const depositStatus = 'PENDING'; // Placeholder

    if (depositStatus !== 'CLEARED') {
      this.logger.warn(
        `Production Gate blocked: Opportunity ${payload.opportunityId} — deposit is ${depositStatus}`,
      );

      return {
        allowed: false,
        reason: `Deposit must be cleared before advancing to Production. Current status: ${depositStatus}`,
      };
    }

    return { allowed: true };
  }

  // Handle payment gateway webhook (Stripe/Square/etc.)
  async handlePaymentWebhook(payload: {
    externalPaymentId: string;
    event: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED' | 'REFUND_CREATED';
    amount: number;
    currency: string;
    opportunityId: string;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `Payment webhook: ${payload.event} for $${payload.amount} on opportunity ${payload.opportunityId}`,
    );

    if (payload.event === 'PAYMENT_SUCCEEDED') {
      await this.updateDepositStatus({
        opportunityId: payload.opportunityId,
        depositStatus: 'CLEARED',
        depositAmount: payload.amount,
        depositCurrency: payload.currency,
        workspaceId: payload.workspaceId,
      });
    } else if (payload.event === 'REFUND_CREATED') {
      await this.updateDepositStatus({
        opportunityId: payload.opportunityId,
        depositStatus: 'REFUNDED',
        workspaceId: payload.workspaceId,
      });
    }
  }
}
