import { Module } from '@nestjs/common';

import { ChecklistGeneratorService } from 'src/modules/project-checklist/services/checklist-generator.service';

@Module({
  providers: [ChecklistGeneratorService],
  exports: [ChecklistGeneratorService],
})
export class ProjectChecklistModule {}
