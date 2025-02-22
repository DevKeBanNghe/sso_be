import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  GetPermissionListByPaginationDto,
  GetPermissionOptionsDto,
  GetPermissionsByRoleDto,
} from './dto/get-permission.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { Permission } from './entities/permission.entity';
import { CaslAbilityFactory } from 'src/common/guards/access-control/casl/casl-ability.factory';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';

@Injectable()
export class PermissionService
  implements
    CreateService<CreatePermissionDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdatePermissionDto>,
    GetOptionsService<GetPermissionOptionsDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private caslAbilityFactory: CaslAbilityFactory,
    private queryUtil: QueryUtilService
  ) {}

  async getPermissionsByRole(getPermissionsByRoleDto: GetPermissionsByRoleDto) {
    return this.prismaService.permission.findMany({
      select: {
        permission_key: true,
      },
      where: {
        roles: {
          every: {
            role_id: getPermissionsByRoleDto.role_id,
            role: {
              webpage: {
                webpage_url: getPermissionsByRoleDto.webpage_url,
              },
            },
          },
        },
      },
    });
  }

  update({ permission_id, ...dataUpdate }: UpdatePermissionDto) {
    return this.prismaService.clientExtended.permission.update({
      data: dataUpdate,
      where: {
        permission_id,
      },
    });
  }

  removePermissionChildren(
    permission_parent_ids: Permission['permission_parent_id'][]
  ) {
    return this.prismaService.permission.updateMany({
      data: {
        permission_parent_id: null,
      },
      where: {
        permission_parent_id: {
          in: permission_parent_ids,
        },
      },
    });
  }
  async remove(ids: Permission['permission_id'][]) {
    await this.removePermissionChildren(ids);
    return this.prismaService.permission.deleteMany({
      where: {
        permission_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: Permission['permission_id']) {
    const permission =
      await this.prismaService.clientExtended.permission.findFirst({
        where: { permission_id: id },
        select: {
          permission_id: true,
          permission_name: true,
          permission_description: true,
          permission_key: true,
          permission_router: true,
          permission_parent_id: true,
          permission_actions: true,
        },
      });
    if (!permission) throw new BadRequestException('Permission not found');
    return permission;
  }

  getList(getPermissionListByPaginationDto: GetPermissionListByPaginationDto) {
    if (!getPermissionListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getPermissionListByPaginationDto);
  }
  getAll() {
    return this.prismaService.permission.findMany({
      select: {
        permission_id: true,
        permission_name: true,
        permission_description: true,
        permission_key: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetPermissionListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const fieldsSelectDefault = {
      permission_id: true,
      permission_name: true,
      permission_description: true,
      permission_key: true,
      permission_router: true,
    };

    const searchQuery = this.queryUtil.buildSearchQuery({
      keys: fieldsSelectDefault,
      value: search,
    });

    const list = await this.prismaService.clientExtended.permission.findMany({
      select: {
        ...fieldsSelectDefault,
        children: {
          select: {
            ...fieldsSelectDefault,
          },
        },
      },
      where: {
        OR: [
          ...searchQuery,
          {
            children: {
              some: {
                OR: [...searchQuery],
              },
            },
          },
        ],
      },
      skip,
      take: itemPerPage,
    });

    return this.apiService.formatPagination<typeof list>({
      list: list.map((item) => {
        return {
          ...item,
          children: item.children.length
            ? item.children.map((child) => ({
                ...child,
                key: `permission_child_${child.permission_id}`,
              }))
            : null,
        };
      }),
      totalItems: await this.prismaService.permission.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreatePermissionDto) {
    return this.prismaService.clientExtended.permission.create({
      data: {
        ...createDto,
      },
    });
  }

  async getOptions({
    role_ids,
    permission_name,
    limit,
  }: GetPermissionOptionsDto) {
    let roleConditions = {};
    if (role_ids) {
      roleConditions = {
        role_id: {
          in: role_ids.split(',').map((item) => parseInt(item)),
        },
      };
    }

    const data = await this.prismaService.rolePermission.findMany({
      select: {
        permission: {
          select: {
            permission_id: true,
            permission_name: true,
          },
        },
      },
      where: {
        permission: {
          permission_name: {
            contains: permission_name,
            mode: 'insensitive',
          },
        },
        ...roleConditions,
      },
      take: limit,
      distinct: ['permission_id'],
    });
    return data.map((item) => item.permission);
  }

  getPermissionActionOptions() {
    return this.caslAbilityFactory.getActions();
  }

  getHttpMethodOptions() {
    return this.apiService.getHttpMethods();
  }
}
