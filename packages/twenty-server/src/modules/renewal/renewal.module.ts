import { Module } from '@nestjs/common';

import { OpportunityClonerService } from 'src/modules/renewal/services/opportunity-cloner.service';

@Module({
  providers: [OpportunityClonerService],
  exports: [OpportunityClonerService],
})
export class RenewalModule {}
