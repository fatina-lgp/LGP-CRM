import { Module } from '@nestjs/common';

import { CpqCalculatorService } from 'src/modules/cpq/services/cpq-calculator.service';
import { CpqController } from 'src/modules/cpq/services/cpq.controller';

@Module({
  controllers: [CpqController],
  providers: [CpqCalculatorService],
  exports: [CpqCalculatorService],
})
export class CpqModule {}
