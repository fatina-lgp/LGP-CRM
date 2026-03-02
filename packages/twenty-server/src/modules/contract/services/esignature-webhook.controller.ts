import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';

import { ContractService } from 'src/modules/contract/services/contract.service';
import { DepositTrackerService } from 'src/modules/contract/services/deposit-tracker.service';

@Controller('api/contracts')
export class EsignatureWebhookController {
  private readonly logger = new Logger(EsignatureWebhookController.name);

  constructor(
    private readonly contractService: ContractService,
    private readonly depositTrackerService: DepositTrackerService,
  ) {}

  // E-signature provider webhook (DocuSign/PandaDoc)
  @Post('webhooks/esignature')
  @HttpCode(HttpStatus.OK)
  async handleEsignatureWebhook(
    @Body()
    body: {
      externalSignatureId: string;
      event: 'VIEWED' | 'SIGNED' | 'DECLINED' | 'EXPIRED';
      signedDocumentUrl?: string;
    },
  ) {
    this.logger.log(`E-sig webhook received: ${body.event}`);

    // TODO: Extract workspaceId from webhook auth/headers
    const workspaceId = 'default-workspace';

    await this.contractService.handleSignatureWebhook({
      ...body,
      workspaceId,
    });

    return { received: true };
  }

  // Payment gateway webhook (Stripe/Square)
  @Post('webhooks/payment')
  @HttpCode(HttpStatus.OK)
  async handlePaymentWebhook(
    @Body()
    body: {
      externalPaymentId: string;
      event: 'PAYMENT_SUCCEEDED' | 'PAYMENT_FAILED' | 'REFUND_CREATED';
      amount: number;
      currency: string;
      opportunityId: string;
    },
  ) {
    this.logger.log(`Payment webhook received: ${body.event}`);

    const workspaceId = 'default-workspace';

    await this.depositTrackerService.handlePaymentWebhook({
      ...body,
      workspaceId,
    });

    return { received: true };
  }
}
