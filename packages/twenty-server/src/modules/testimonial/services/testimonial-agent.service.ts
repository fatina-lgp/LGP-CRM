import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TestimonialAgentService {
  private readonly logger = new Logger(TestimonialAgentService.name);

  // Generate a testimonial draft from survey feedback
  async generateTestimonial(payload: {
    opportunityId: string;
    rawFeedback: string;
    clientName: string;
    companyName: string;
    workspaceId: string;
  }): Promise<{
    testimonialId: string;
    draftedContent: string;
  }> {
    this.logger.log(
      `Generating testimonial for ${payload.companyName} from survey feedback`,
    );

    // TODO: Integrate with AiService for actual LLM generation
    const prompt = this.buildPrompt(payload);

    const draftedContent = `[AI-drafted testimonial pending for ${payload.companyName}]`;
    const testimonialId = crypto.randomUUID();

    // TODO: Persist Testimonial via Twenty ORM

    return { testimonialId, draftedContent };
  }

  private buildPrompt(payload: {
    rawFeedback: string;
    clientName: string;
    companyName: string;
  }): string {
    return `You are a marketing copywriter for LGP, specializing in quarterly merchandise activations (QMA).

Based on the following client feedback, draft a professional testimonial quote that:
1. Captures the client's positive experience
2. Highlights specific outcomes or benefits
3. Is 2-3 sentences long, suitable for a website or marketing materials
4. Sounds natural and authentic

Client: ${payload.clientName} from ${payload.companyName}
Raw Feedback: ${payload.rawFeedback}

Output only the testimonial quote, wrapped in quotation marks, followed by "— ${payload.clientName}, ${payload.companyName}"`;
  }
}
