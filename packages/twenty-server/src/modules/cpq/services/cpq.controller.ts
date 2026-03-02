import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Post } from '@nestjs/common';

import { CpqCalculatorService } from 'src/modules/cpq/services/cpq-calculator.service';

@Controller('api/quotes')
export class CpqController {
  private readonly logger = new Logger(CpqController.name);

  constructor(private readonly cpqCalculatorService: CpqCalculatorService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generateQuote(
    @Body()
    body: {
      tier: string;
      headcount: number;
      leadId?: string;
      opportunityId?: string;
      customFees?: { description: string; amount: number }[];
      discountPercent?: number;
      taxPercent?: number;
    },
  ) {
    this.logger.log(`Generating quote: ${body.tier} × ${body.headcount}`);

    const calculation = this.cpqCalculatorService.generateQuote({
      tier: body.tier,
      headcount: body.headcount,
      customFees: body.customFees,
      discountPercent: body.discountPercent,
      taxPercent: body.taxPercent,
    });

    // TODO: Persist Quote + QuoteLineItems via Twenty ORM

    return { success: true, data: calculation };
  }

  @Get('tiers')
  listTiers() {
    return { success: true, data: this.cpqCalculatorService.listTiers() };
  }

  @Get('tiers/:tier')
  getTierPricing(@Param('tier') tier: string) {
    const pricing = this.cpqCalculatorService.getTierPricing(tier);

    if (!pricing) {
      return { success: false, error: `Tier '${tier}' not found` };
    }

    return { success: true, data: { tier, pricing } };
  }
}
