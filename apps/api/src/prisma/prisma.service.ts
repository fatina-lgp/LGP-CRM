import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Wrap (not extend) so TypeScript sees the full Prisma model accessors correctly
const prismaInstance = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Expose all Prisma model accessors
  get user() { return prismaInstance.user; }
  get lead() { return prismaInstance.lead; }
  get activity() { return prismaInstance.activity; }

  // Expose transaction helper
  get $transaction() { return prismaInstance.$transaction.bind(prismaInstance); }

  async onModuleInit() {
    try {
      await prismaInstance.$connect();
      this.logger.log('✅ Database connected');
    } catch (err) {
      this.logger.error('❌ Database connection failed', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await prismaInstance.$disconnect();
  }
}
