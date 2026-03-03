import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prismaInstance = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  get user() { return prismaInstance.user; }
  get lead() { return prismaInstance.lead; }
  get activity() { return prismaInstance.activity; }
  get $transaction() { return prismaInstance.$transaction.bind(prismaInstance); }

  async onModuleInit() {
    // Non-fatal: allow app to start even if DB is temporarily unreachable.
    // Cloud Run health check passes as long as we listen on port 3000.
    // Prisma will reconnect lazily on the first query.
    try {
      await prismaInstance.$connect();
      this.logger.log('✅ Database connected');
    } catch (err) {
      this.logger.warn('⚠️  Database not immediately available — will retry on first query');
      this.logger.warn(String(err));
      // Do NOT re-throw — let NestJS finish bootstrapping and bind to the port
    }
  }

  async onModuleDestroy() {
    try {
      await prismaInstance.$disconnect();
    } catch {
      // ignore disconnect errors on shutdown
    }
  }
}
