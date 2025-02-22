import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/postgresql_client';
import { CreateExtends, UpdateExtends } from './interfaces/create.interface';
import { DateUtilService } from 'src/common/utils/date/date-util.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private is_connected = false;
  private readonly RETRY_AFTER = 3000; // ms
  private _clientExtended: ReturnType<typeof this.initClientExtended>;

  constructor(private dateUtilService: DateUtilService) {
    super({
      transactionOptions: {
        // This feature is not available on MongoDB, because MongoDB does not support isolation levels.
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    });
    this.initClientExtended();
  }

  initClientExtended() {
    const clientExtended = this.$extends({
      query: {
        $allModels: {
          findFirst: async ({ args, query }) => {
            args.where = { ...args.where, deleted_at: null };
            return query(args);
          },
          findMany: async ({ args, query }) => {
            args.select = {
              ...(args.select ?? {}),
              created_at: true,
              created_by: true,
              updated_at: true,
              updated_by: true,
              is_active: true,
            };
            args.where = { ...args.where, deleted_at: null };
            args.orderBy = [{ updated_at: 'desc' }, { created_at: 'desc' }];
            return query(args);
          },
          create: async ({ args, query }) => {
            const { user, ...argsRemain } = args.data as CreateExtends<
              typeof args.data
            >;
            const currentUser =
              user?.user_name ??
              ('user_name' in argsRemain ? argsRemain.user_name : null);
            args.data = { ...argsRemain, created_by: currentUser };
            return query(args);
          },
          update: async ({ args, query }) => {
            const { user, ...argsRemain } = args.data as UpdateExtends<
              typeof args.data
            >;
            args.data = { ...argsRemain, updated_by: user.user_name };
            return query(args);
          },
          updateMany: async ({ args, query }) => {
            const { user, ...argsRemain } = args.data as UpdateExtends<
              typeof args.data
            >;
            args.data = { ...argsRemain, updated_by: user.user_name };
            return query(args);
          },
        },
      },
      model: {
        $allModels: {
          async softDelete<T>(
            this: T,
            where: Prisma.Args<T, 'deleteMany'>['where']
          ) {
            const context = Prisma.getExtensionContext(this) as any;
            const result = await context.updateMany({
              data: { deleted_at: new Date() },
              where,
            });
            return result;
          },
          async restore<T>(
            this: T,
            where: Prisma.Args<T, 'findMany'>['where']
          ) {
            const context = Prisma.getExtensionContext(this) as any;
            const result = await context.updateMany({
              data: { deleted_at: null },
              where,
            });
            return result;
          },
        },
      },
      result: {
        $allModels: {
          created_at: {
            compute: ({ created_at }) =>
              this.dateUtilService.formatDate(created_at),
          },
          updated_at: {
            compute: ({ updated_at }) =>
              this.dateUtilService.formatDate(updated_at),
          },
        },
      },
    });
    this._clientExtended = clientExtended;
    return clientExtended;
  }

  get clientExtended() {
    return this._clientExtended;
  }

  getStatus() {
    return this.is_connected;
  }

  private async connectToPrisma() {
    try {
      await this.$connect();
      Logger.log('Connected to Prisma successfully!');
      this.is_connected = true;
    } catch (error) {
      Logger.error('Error connecting to prisma, connecting...');
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
