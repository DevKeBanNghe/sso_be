import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/postgresql_client';
import { PrismaClient } from '@prisma/postgresql_client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private is_connected = false;
  private readonly RETRY_AFTER = 3000; // ms

  constructor() {
    super({
      transactionOptions: {
        // This feature is not available on MongoDB, because MongoDB does not support isolation levels.
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    });
  }

  getStatus() {
    return this.is_connected;
  }

  private async connectToPrisma() {
    try {
      await this.$connect();
      Logger.log('Connected to Prisma successfully !');
      this.is_connected = true;
    } catch (error) {
      Logger.error('Error connecting to prisma, retrying ...');
      setTimeout(async () => {
        await this.connectToPrisma();
      }, this.RETRY_AFTER);
    }
  }

  async onModuleInit() {
    await this.connectToPrisma();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
