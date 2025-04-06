import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/postgresql_client';
import { DateUtilService } from 'src/common/utils/date/date-util.service';
import { isArray, omit } from 'lodash';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private _is_connected = false;
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

  filterArgs({ data, model }): any {
    const fieldsOmit = ['user'];
    switch (model) {
      case 'User':
        fieldsOmit.push('is_supper_admin');
        break;
      case 'UserWebpage':
        fieldsOmit.push('created_by');
        break;
    }
    return isArray(data)
      ? data.map((item) => omit(item, fieldsOmit))
      : omit(data, fieldsOmit);
  }

  getCurrentUser(data) {
    return data?.user?.user_name ?? data?.user_name;
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
            const argsData = args.data;
            const filterData = this.filterArgs({
              data: { ...argsData, created_by: this.getCurrentUser(argsData) },
              model,
            });
            args.data = filterData;
            return query(args);
          },
          createMany: async ({ args, query, model }) => {
            const argsData: any = args.data;
            const filterData = this.filterArgs({
              data: argsData.map((item) => ({
                ...item,
                created_by: this.getCurrentUser(item),
              })),
              model,
            });
            args.data = filterData;
            return query(args);
          },
          update: async ({ args, query, model }) => {
            const argsData = args.data;
            const currentUser = this.getCurrentUser(argsData);
            const filterData = this.filterArgs({ data: argsData, model });
            args.data = {
              ...filterData,
              updated_by: currentUser,
            };
            return query(args);
          },
          updateMany: async ({ args, query, model }) => {
            const argsData = args.data;
            const currentUser = this.getCurrentUser(argsData);
            const filterData = this.filterArgs({ data: argsData, model });
            args.data = {
              ...filterData,
              updated_by: currentUser,
            };
            return query(args);
          },
          count: async ({ args, query }) => {
            args.where = { ...args.where, deleted_at: null };
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

  get is_connected() {
    return this._is_connected;
  }

  private set is_connected(is_connected: boolean) {
    this._is_connected = is_connected;
  }

  private async connectToPrisma() {
    const className = this.constructor.name;
    try {
      await this.$connect();
      Logger.log({
        message: 'Connected to Prisma successfully!',
        context: className,
      });
      this.is_connected = true;
    } catch (error) {
      Logger.error({
        message: 'Error connecting to prisma, connecting...',
        context: className,
      });
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
