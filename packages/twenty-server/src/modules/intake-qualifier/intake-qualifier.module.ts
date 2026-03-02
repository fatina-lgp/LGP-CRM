import { Module } from '@nestjs/common';

import { IntakeQualifierController } from 'src/modules/intake-qualifier/services/intake-qualifier.controller';
import { IntakeQualifierService } from 'src/modules/intake-qualifier/services/intake-qualifier.service';

@Module({
  controllers: [IntakeQualifierController],
  providers: [IntakeQualifierService],
  exports: [IntakeQualifierService],
})
export class IntakeQualifierModule {}
