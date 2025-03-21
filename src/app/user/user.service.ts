import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import {
  CreateUserDto,
  CreateUsersSubscribeWebpageDto,
} from './dto/create-user.dto';
import { UpdateActivateStatusDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import {
  GetUserByIDParams,
  GetUserByParams,
  GetUserListByPaginationDto,
  GetUserPermissionsParams,
  GetUsersSubscribeWebpageDto,
} from './dto/get-user.dto';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { BaseInstance } from 'src/common/classes/base.class';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';
import { User } from '@prisma-postgresql/models';
import { WebpageService } from '../webpage/webpage.service';

@Injectable()
export class UserService
  extends BaseInstance
  implements
    CreateService<CreateUserDto>,
    UpdateService<UpdateUserDto>,
    GetAllService,
    GetDetailService,
    DeleteService
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private stringUtilService: StringUtilService,
    private queryUtil: QueryUtilService,
    private webpageService: WebpageService
  ) {
    super();
  }

  get instance() {
    return this.prismaService.user;
  }

  get extended() {
    return this.prismaService.clientExtended.user;
  }

  remove(ids: User['user_id'][]) {
    return this.prismaService.clientExtended.user.softDelete({
      user_id: {
        in: ids,
      },
    });
  }

  private async getUserByID({ select, user_id }: GetUserByIDParams) {
    const user = await this.prismaService.user.findFirst({
      where: { user_id },
      select,
    });
    if (!user) throw new BadRequestException('User not found!');
    return user;
  }

  async getDetail(id: User['user_id']) {
    const user = await this.getUserByID({
      user_id: id,
      select: {
        user_id: true,
        user_name: true,
      },
    });
    return user;
  }

  async isUserActive(id: User['user_id']) {
    const user = await this.prismaService.user.findFirst({
      where: { user_id: id, is_active: 1 },
      select: { user_id: true },
    });
    return user ? true : false;
  }

  getList(getListByPaginationDto: GetUserListByPaginationDto) {
    if (!getListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getListByPaginationDto);
  }

  getAll() {
    return this.prismaService.user.findMany({
      select: {
        user_id: true,
        user_name: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetUserListByPaginationDto) {
    const userFieldsSelect = {
      user_id: true,
      user_name: true,
    };

    const userSearchQuery = this.queryUtil.buildSearchQuery({
      keys: userFieldsSelect,
      value: search,
    });

    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.clientExtended.user.findMany({
      select: {
        ...{ ...userFieldsSelect, user_type_login: true },
        roles: {
          select: {
            role: {
              select: {
                role_id: true,
                role_name: true,
              },
            },
          },
        },
      },
      where: {
        OR: userSearchQuery,
      },
      skip,
      take: itemPerPage,
    });

    const listData = list.map((item) => ({
      ...item,
      roles: item.roles.map(({ role }) => role),
    }));
    return this.apiService.formatPagination<typeof listData>({
      list: listData,
      totalItems: await this.instance.count(),
      page,
      itemPerPage,
    });
  }

  async update(updateDto: UpdateUserDto) {
    const {
      user_id,
      user_password: user_password_update,
      ...dataUpdate
    } = updateDto;

    const user = await this.getUserByID({
      user_id,
      select: {
        user_password: true,
      },
    });

    const user_password = user_password_update
      ? await this.stringUtilService.hashSync(user_password_update)
      : user.user_password;
    return this.prismaService.clientExtended.user.update({
      where: { user_id },
      data: {
        ...dataUpdate,
        user_password,
      },
    });
  }

  async create(createDto: CreateUserDto) {
    return await this.prismaService.clientExtended.user.create({
      data: {
        ...createDto,
      },
      select: {
        user_name: true,
        user_id: true,
      },
    });
  }

  async getUserPermissions({
    user_id,
    permission_router,
    httpMethod,
  }: GetUserPermissionsParams) {
    const defaultSelect = {
      permissions: {
        select: {
          permission: {
            select: {
              permission_actions: true,
              permission_router: true,
            },
          },
        },
        where: {
          permission: {
            permission_router,
            permission_actions: {
              path: [httpMethod],
              not: null,
            },
          },
        },
      },
    };

    const rolesData = await this.prismaService.user.findFirst({
      select: {
        roles: {
          select: {
            role: {
              select: {
                ...defaultSelect,
                children: {
                  select: {
                    ...defaultSelect,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        user_id,
      },
    });

    if (!rolesData) return [];
    const data = rolesData.roles.reduce<Record<string, string[]>[]>(
      (acc, { role }) => {
        const permissionData = role.permissions.reduce(
          (acc, { permission: { permission_actions, permission_router } }) => {
            for (const [httpMethod, actions] of Object.entries(
              permission_actions
            )) {
              acc.push({ [`${permission_router}_${httpMethod}`]: actions });
            }
            return acc;
          },
          []
        );
        const permissionChildrenData = role.children.reduce(
          (acc, { permissions }) => {
            const permissionData = permissions.reduce(
              (
                acc,
                { permission: { permission_actions, permission_router } }
              ) => {
                for (const [httpMethod, actions] of Object.entries(
                  permission_actions
                )) {
                  acc.push({ [`${permission_router}_${httpMethod}`]: actions });
                }
                return acc;
              },
              []
            );
            return [...acc, ...permissionData];
          },
          []
        );

        return [...acc, ...permissionData, ...permissionChildrenData];
      },
      []
    );

    return data;
  }

  updateActivateStatus({ user_ids, ...dataUpdate }: UpdateActivateStatusDto) {
    return this.prismaService.clientExtended.user.updateMany({
      data: dataUpdate,
      where: {
        user_id: {
          in: user_ids,
        },
      },
    });
  }

  async isSupperAdmin({ user_id }: { user_id: User['user_id'] }) {
    const data = await this.prismaService.clientExtended.user.findFirst({
      where: {
        user_id,
        is_supper_admin: 1,
        is_active: 1,
      },
    });
    return data ? true : false;
  }

  async getUserBy({ user_email }: GetUserByParams) {
    const user = await this.prismaService.user.findFirst({
      select: { user_id: true },
      where: { user_email },
    });
    return user;
  }

  async createUsersSubscribeWebpage({
    webpage_key,
    user_email,
  }: CreateUsersSubscribeWebpageDto) {
    const webpage = await this.webpageService.getDetailBy({ webpage_key });
    const user = await this.getUserBy({ user_email });
    let user_id = user?.user_id;
    if (!user_id) {
      const { user_id: userIDSignUp } = await this.create({
        user_name: user_email,
        user_email,
      });
      user_id = userIDSignUp;
    }
    const data = await this.prismaService.clientExtended.userWebpage.create({
      data: { webpage_id: webpage.webpage_id, user_id },
    });
    return data;
  }

  async getUsersSubscribeWebpage({ webpage_key }: GetUsersSubscribeWebpageDto) {
    const data = await this.prismaService.userWebpage.findMany({
      select: {
        user: {
          select: {
            user_id: true,
            user_email: true,
          },
        },
      },
      where: {
        webpage: { webpage_key },
      },
    });
    return data.map((item) => item.user);
  }
}
