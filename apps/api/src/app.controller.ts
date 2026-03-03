import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthz')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  root() {
    return { name: 'LGP CRM API', version: '1.0.0' };
  }
}
