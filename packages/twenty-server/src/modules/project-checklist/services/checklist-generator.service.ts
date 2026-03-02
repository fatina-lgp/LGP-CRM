import { Injectable, Logger } from '@nestjs/common';

export interface ProcessMapTemplate {
  name: string;
  items: { title: string; description: string; daysOffset: number }[];
}

@Injectable()
export class ChecklistGeneratorService {
  private readonly logger = new Logger(ChecklistGeneratorService.name);

  // LGP QMA Process Map templates
  private readonly templates: Record<string, ProcessMapTemplate> = {
    STANDARD_QMA: {
      name: 'Standard QMA Activation',
      items: [
        { title: 'Send Pre-Activation Survey (Email 4)', description: 'Distribute survey to client contacts', daysOffset: 0 },
        { title: 'Collect Brand Assets', description: 'Receive logo, brand guidelines, color palettes from client', daysOffset: 3 },
        { title: 'Survey Results Review', description: 'Analyze survey responses and determine catalog preferences', daysOffset: 7 },
        { title: 'Curate Product Catalog', description: 'Select merchandise items based on tier and survey results', daysOffset: 10 },
        { title: 'Submit Samples for Approval', description: 'Send product samples to client portal for review', daysOffset: 14 },
        { title: 'Client Approval (3-day window)', description: 'Wait for client approval or auto-approve after 3 business days', daysOffset: 17 },
        { title: 'Finalize Product Selection', description: 'Lock product choices and quantities based on headcount', daysOffset: 21 },
        { title: 'Place Production Order', description: 'Submit order to vendors with branding specifications', daysOffset: 22 },
        { title: 'Branding & Customization QC', description: 'Review branded samples for quality', daysOffset: 28 },
        { title: 'Final Headcount Confirmation', description: 'Get final headcount from client (Week 6-7)', daysOffset: 35 },
        { title: 'Internal QC Sign-Off', description: 'Complete internal quality check before shipment', daysOffset: 38 },
        { title: 'Ship to Venue', description: 'Coordinate logistics and shipment', daysOffset: 40 },
      ],
    },
  };

  // Generate a checklist from a template
  generateChecklist(payload: {
    templateName: string;
    opportunityId: string;
    startDate: string;
    workspaceId: string;
  }): {
    checklistId: string;
    templateName: string;
    items: { title: string; description: string; dueDate: string; sortOrder: number }[];
  } {
    const template = this.templates[payload.templateName];

    if (!template) {
      throw new Error(`Template '${payload.templateName}' not found`);
    }

    const startDate = new Date(payload.startDate);
    const checklistId = crypto.randomUUID();

    const items = template.items.map((item, index) => {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + item.daysOffset);

      return {
        title: item.title,
        description: item.description,
        dueDate: dueDate.toISOString(),
        sortOrder: index + 1,
      };
    });

    this.logger.log(
      `Generated checklist '${template.name}' with ${items.length} items for opportunity ${payload.opportunityId}`,
    );

    // TODO: Persist ProjectChecklist + ChecklistItems via Twenty ORM

    return { checklistId, templateName: template.name, items };
  }

  listTemplates(): { name: string; itemCount: number }[] {
    return Object.entries(this.templates).map(([key, template]) => ({
      name: key,
      itemCount: template.items.length,
    }));
  }
}
