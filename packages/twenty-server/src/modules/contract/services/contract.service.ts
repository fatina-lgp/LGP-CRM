import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  // Create a contract/SOW from a quote
  async createContract(payload: {
    quoteId: string;
    opportunityId: string;
    contractType: 'CONTRACT' | 'SOW';
    workspaceId: string;
  }): Promise<{ contractId: string }> {
    this.logger.log(
      `Creating ${payload.contractType} for quote ${payload.quoteId}`,
    );

    // TODO: Create Contract record via Twenty ORM
    const contractId = crypto.randomUUID();

    return { contractId };
  }

  // Send contract for e-signature
  async sendForSignature(payload: {
    contractId: string;
    recipientEmail: string;
    recipientName: string;
    workspaceId: string;
  }): Promise<{ externalSignatureId: string }> {
    this.logger.log(
      `Sending contract ${payload.contractId} to ${payload.recipientEmail} for signature`,
    );

    // TODO: Integrate with DocuSign/PandaDoc API
    // 1. Upload document to e-sig provider
    // 2. Create signing request
    // 3. Store externalSignatureId in Contract record
    const externalSignatureId = `esig_${crypto.randomUUID()}`;

    return { externalSignatureId };
  }

  // Handle webhook from e-signature provider (DocuSign/PandaDoc)
  async handleSignatureWebhook(payload: {
    externalSignatureId: string;
    event: 'VIEWED' | 'SIGNED' | 'DECLINED' | 'EXPIRED';
    signedDocumentUrl?: string;
    workspaceId: string;
  }): Promise<void> {
    this.logger.log(
      `E-signature webhook: ${payload.externalSignatureId} → ${payload.event}`,
    );

    // TODO: Find Contract by externalSignatureId via Twenty ORM
    // TODO: Update Contract status
    // TODO: If SIGNED, store signedDocumentUrl
    // TODO: Emit workspace event for timeline logging

    if (payload.event === 'SIGNED') {
      this.logger.log('Contract signed — triggering invoice generation flow');
      // TODO: Trigger invoice/deposit collection workflow
    }
  }
}
