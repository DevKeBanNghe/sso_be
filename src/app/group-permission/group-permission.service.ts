import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupPermissionDto } from './dto/create-group-permission.dto';
import {
  UpdateGroupPermissionDto,
  UpdateGroupRoleDto,
} from './dto/update-group-permission.dto';
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
  GetGroupPermissionListByPaginationDto,
  GetGroupPermissionOptionsDto,
} from './dto/get-group-permission.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class GroupPermissionService
  implements
    GetAllService,
    CreateService<CreateGroupPermissionDto>,
    GetOptionsService<GetGroupPermissionOptionsDto>,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateGroupPermissionDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private permissionsService: PermissionService
  ) {}

  private async removeGroupRoleExist(group_role_id: number) {
    return this.prismaService.groupPermission.updateMany({
      data: {
        group_role_id: null,
      },
      where: {
        group_role_id,
      },
    });
  }

  async updateGroupRole({
    group_role_id,
    group_permission_ids,
  }: UpdateGroupRoleDto) {
    await this.removeGroupRoleExist(group_role_id);
    return this.prismaService.groupPermission.updateMany({
      data: {
        group_role_id,
      },
      where: {
        group_permission_id: {
          in: group_permission_ids,
        },
      },
    });
  }

  async create({ permission_ids, ...dataCreate }: CreateGroupPermissionDto) {
    const dataGroupPermission = await this.prismaService.groupPermission.create(
      {
        data: {
          ...dataCreate,
        },
      }
    );

    await this.permissionsService.updateGroupPermission({
      group_permission_id: dataGroupPermission.group_permission_id,
      permission_ids,
    });

    return dataGroupPermission;
  }

  async update({
    group_permission_id,
    permission_ids,
    ...dataUpdate
  }: UpdateGroupPermissionDto) {
    const dataGroupPermission = await this.prismaService.groupPermission.update(
      {
        data: dataUpdate,
        where: {
          group_permission_id,
        },
      }
    );
    await this.permissionsService.updateGroupPermission({
      group_permission_id,
      permission_ids,
    });

    return dataGroupPermission;
  }
  remove(ids: number[]) {
    return this.prismaService.groupPermission.deleteMany({
      where: {
        group_permission_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const groupPermission = await this.prismaService.groupPermission.findUnique(
      {
        where: { group_permission_id: id },
        select: {
          group_permission_id: true,
          group_permission_name: true,
          group_permission_description: true,
          group_permission_parent_id: true,
          group_permission_route_resources: true,
          Permission: {
            select: {
              permission_id: true,
            },
          },
        },
      }
    );
    if (!groupPermission) throw new BadRequestException('Group Role not found');

    const { Permission, ...groupPermissionDetail } = groupPermission;
    return {
      ...groupPermissionDetail,
      permission_ids: Permission.map((item) => item.permission_id),
    };
  }

  getList(
    getGroupPermissionListByPaginationDto: GetGroupPermissionListByPaginationDto
  ) {
    if (!getGroupPermissionListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getGroupPermissionListByPaginationDto);
  }
  getAll() {
    return this.prismaService.groupPermission.findMany({
      select: {
        group_permission_id: true,
        group_permission_name: true,
        group_permission_description: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
  }: GetGroupPermissionListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.groupPermission.findMany({
      select: {
        group_permission_id: true,
        group_permission_name: true,
        group_permission_description: true,
        Permission: {
          select: {
            permission_id: true,
            permission_name: true,
          },
        },
      },
      skip,
      take: itemPerPage,
      orderBy: {
        group_permission_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.groupPermission.count(),
      page,
      itemPerPage,
    });
  }

  getOptions(getOptionsDto: GetGroupPermissionOptionsDto) {
    return this.prismaService.groupPermission.findMany({
      select: {
        group_permission_id: true,
        group_permission_name: true,
      },
      where: {
        group_permission_name: {
          contains: getOptionsDto.group_permission_name,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
}
