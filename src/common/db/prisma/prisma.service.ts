import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/postgresql_client';
import { DateUtilService } from 'src/common/utils/date/date-util.service';
import { omit } from 'lodash';
import { REQUEST } from '@nestjs/core';
import { Request } from 'src/common/interfaces/http.interface';
@Injectable({ scope: Scope.REQUEST })
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private is_connected = false;
  private readonly RETRY_AFTER = 3000; // ms
  private _clientExtended: ReturnType<typeof this.initClientExtended>;

  constructor(
    private dateUtilService: DateUtilService,
    @Inject(REQUEST) private request: Request
  ) {
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

  filterArgs({ data, model }) {
    switch (model) {
      case 'User':
        return omit(data, ['is_supper_admin']);
      default:
        return data;
    }
  }

  getCurrentUser(data) {
    return data?.user_name ?? this.request?.user?.user_name;
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
          create: async ({ args, query, model }) => {
            const filterData = this.filterArgs({ data: args.data, model });
            const currentUser = this.getCurrentUser(filterData);
            args.data = { ...filterData, created_by: currentUser };
            return query(args);
          },
          update: async ({ args, query, model }) => {
            const filterData = this.filterArgs({ data: args.data, model });
            const currentUser = this.getCurrentUser(filterData);
            args.data = {
              ...filterData,
              updated_by: currentUser,
            };
            return query(args);
          },
          updateMany: async ({ args, query, model }) => {
            const filterData = this.filterArgs({ data: args.data, model });
            const currentUser = this.getCurrentUser(filterData);
            args.data = {
              ...filterData,
              updated_by: currentUser,
            };
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
            const context: any = Prisma.getExtensionContext(this);
            const result = await context.updateMany({
              data: { deleted_at: new Date(), is_active: 0 },
              where,
            });
            return result;
          },
          async restore<T>(
            this: T,
            where: Prisma.Args<T, 'updateMany'>['where']
          ) {
            const context: any = Prisma.getExtensionContext(this);
            const result = await context.updateMany({
              data: { deleted_at: null, is_active: 0 },
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
