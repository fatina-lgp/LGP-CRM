import { Module } from '@nestjs/common';

import { TestimonialAgentService } from 'src/modules/testimonial/services/testimonial-agent.service';

@Module({
  providers: [TestimonialAgentService],
  exports: [TestimonialAgentService],
})
export class TestimonialModule {}
