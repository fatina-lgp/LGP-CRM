import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CallSummaryAgentService {
  private readonly logger = new Logger(CallSummaryAgentService.name);

  // Generate an AI summary from a call recording or transcript
  async generateSummary(payload: {
    discoveryCallId: string;
    recordingUrl?: string;
    transcript?: string;
    workspaceId: string;
  }): Promise<{
    summary: string;
    actionItems: string[];
  }> {
    this.logger.log(
      `Generating AI summary for discovery call ${payload.discoveryCallId}`,
    );

    // TODO: Integrate with Twenty's AiService for actual LLM calls
    // import { AiService } from 'src/engine/metadata-modules/ai/ai-models/services/ai.service';
    //
    // Steps:
    // 1. If recordingUrl provided, fetch/transcribe (via Whisper or external service)
    // 2. If transcript provided, use directly
    // 3. Send to AiService with structured prompt
    // 4. Parse response into summary + action items

    const prompt = this.buildSummaryPrompt(payload.transcript ?? '');

    // Placeholder — will be replaced with actual AiService call
    const summary = `[AI Summary pending for call ${payload.discoveryCallId}]`;
    const actionItems = ['[Action items will be extracted by AI agent]'];

    this.logger.log(
      `AI summary generated for discovery call ${payload.discoveryCallId}`,
    );

    return { summary, actionItems };
  }

  private buildSummaryPrompt(transcript: string): string {
    return `You are an expert sales call analyst for LGP, a company that specializes in quarterly merchandise activations (QMA).

Analyze the following discovery call transcript and provide:

1. **Call Summary** (3-5 sentences): Key topics discussed, client needs identified, and overall sentiment.

2. **Action Items** (bulleted list): Specific follow-up tasks with owners where identifiable.

3. **Qualification Signals**: Any mentions of:
   - Budget/budget owner
   - Headcount/team size
   - Timeline/urgency
   - Current solution/competitor
   - Pain points

4. **Recommended Next Steps**: What should the salesperson do next based on this conversation?

---

TRANSCRIPT:
${transcript}

---

Respond in JSON format:
{
  "summary": "...",
  "actionItems": ["...", "..."],
  "qualificationSignals": { "budget": "...", "headcount": "...", "timeline": "...", "painPoints": "..." },
  "recommendedNextSteps": ["...", "..."]
}`;
  }
}
