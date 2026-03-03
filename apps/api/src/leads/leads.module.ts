import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  providers: [LeadsService],
  controllers: [LeadsController],
})
export class LeadsModule {}
