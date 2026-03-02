import { Injectable, Logger } from '@nestjs/common';

export interface TierPricing {
  basePricePerHead: number;
  setupFee: number;
  shippingFee: number;
  brandingFee: number;
  minHeadcount: number;
  maxHeadcount: number;
}

export interface LineItem {
  description: string;
  sku?: string;
  category: 'MERCHANDISE' | 'SHIPPING' | 'SETUP' | 'CUSTOM_FEE';
  quantity: number;
  unitPrice: number;
}

export interface QuoteCalculation {
  tier: string;
  lineItems: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

@Injectable()
export class CpqCalculatorService {
  private readonly logger = new Logger(CpqCalculatorService.name);

  // Tier pricing definitions for LGP QMA
  private readonly tierPricing: Record<string, TierPricing> = {
    TIER_1: {
      basePricePerHead: 45,
      setupFee: 500,
      shippingFee: 250,
      brandingFee: 300,
      minHeadcount: 50,
      maxHeadcount: 150,
    },
    TIER_2: {
      basePricePerHead: 35,
      setupFee: 750,
      shippingFee: 400,
      brandingFee: 500,
      minHeadcount: 151,
      maxHeadcount: 500,
    },
    TIER_3: {
      basePricePerHead: 25,
      setupFee: 1000,
      shippingFee: 600,
      brandingFee: 750,
      minHeadcount: 501,
      maxHeadcount: 2000,
    },
  };

  // Generate a full quote based on tier and headcount
  generateQuote(payload: {
    tier: string;
    headcount: number;
    customFees?: { description: string; amount: number }[];
    discountPercent?: number;
    taxPercent?: number;
  }): QuoteCalculation {
    const pricing = this.tierPricing[payload.tier];

    if (!pricing) {
      throw new Error(`Invalid tier: ${payload.tier}. Must be TIER_1, TIER_2, or TIER_3.`);
    }

    if (payload.headcount < pricing.minHeadcount || payload.headcount > pricing.maxHeadcount) {
      this.logger.warn(
        `Headcount ${payload.headcount} outside tier ${payload.tier} range (${pricing.minHeadcount}-${pricing.maxHeadcount})`,
      );
    }

    const lineItems: LineItem[] = [
      {
        description: `${payload.tier} Merchandise Package`,
        category: 'MERCHANDISE',
        quantity: payload.headcount,
        unitPrice: pricing.basePricePerHead,
      },
      {
        description: 'Event Setup Fee',
        category: 'SETUP',
        quantity: 1,
        unitPrice: pricing.setupFee,
      },
      {
        description: 'Shipping & Handling',
        category: 'SHIPPING',
        quantity: 1,
        unitPrice: pricing.shippingFee,
      },
      {
        description: 'Custom Branding Fee',
        category: 'SETUP',
        quantity: 1,
        unitPrice: pricing.brandingFee,
      },
    ];

    // Add custom fees
    if (payload.customFees) {
      for (const fee of payload.customFees) {
        lineItems.push({
          description: fee.description,
          category: 'CUSTOM_FEE',
          quantity: 1,
          unitPrice: fee.amount,
        });
      }
    }

    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const discountPercent = payload.discountPercent ?? 0;
    const discount = subtotal * (discountPercent / 100);
    const taxableAmount = subtotal - discount;
    const taxPercent = payload.taxPercent ?? 0;
    const tax = taxableAmount * (taxPercent / 100);
    const total = taxableAmount + tax;

    this.logger.log(
      `Quote generated: ${payload.tier} × ${payload.headcount} heads = $${total.toFixed(2)}`,
    );

    return {
      tier: payload.tier,
      lineItems,
      subtotal,
      discount,
      tax,
      total,
    };
  }

  // Get tier pricing info
  getTierPricing(tier: string): TierPricing | null {
    return this.tierPricing[tier] ?? null;
  }

  // List all available tiers
  listTiers(): { tier: string; pricing: TierPricing }[] {
    return Object.entries(this.tierPricing).map(([tier, pricing]) => ({
      tier,
      pricing,
    }));
  }
}
