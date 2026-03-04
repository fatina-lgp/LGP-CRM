import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('healthz')
  async health() {
    let db = { connected: false, error: '' };
    try {
      const count = await this.prisma.user.count();
      db = { connected: true, error: '' };
    } catch (err: any) {
      db = { connected: false, error: err?.message || String(err) };
    }
    return {
      status: 'ok',
      version: 'v2-d1db1caf',
      timestamp: new Date().toISOString(),
      db,
    };
  }

  @Get()
  root() {
    return { name: 'LGP CRM API', version: '2.0.0' };
  }
}
