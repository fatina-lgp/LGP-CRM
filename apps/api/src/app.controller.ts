import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('healthz')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  root() {
    return { name: 'LGP CRM API', version: '1.0.0' };
  }

  @Get('debug/db')
  async debugDb() {
    try {
      const count = await this.prisma.user.count();
      return { dbConnected: true, userCount: count };
    } catch (err) {
      return { dbConnected: false, error: String(err), message: err?.message };
    }
  }
}
