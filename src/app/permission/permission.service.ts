import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  UpdateGroupPermissionDto,
  UpdatePermissionDto,
} from './dto/update-permission.dto';
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
    private apiService: ApiService
  ) {}

  private async removeGroupPermissionExist(group_permission_id: number) {
    return this.prismaService.permission.updateMany({
      data: {
        group_permission_id: null,
      },
      where: {
        group_permission_id,
      },
    });
  }
  async updateGroupPermission({
    group_permission_id,
    permission_ids,
  }: UpdateGroupPermissionDto) {
    await this.removeGroupPermissionExist(group_permission_id);
    return this.prismaService.permission.updateMany({
      data: {
        group_permission_id,
      },
      where: {
        permission_id: {
          in: permission_ids,
        },
      },
    });
  }

  async getPermissionsByRole(getPermissionsByRoleDto: GetPermissionsByRoleDto) {
    return this.prismaService.permission.findMany({
      select: {
        permission_key: true,
      },
      where: {
        GroupPermission: {
          GroupRole: {
            AND: {
              Webpage: {
                webpage_url: getPermissionsByRoleDto.webpage_url,
              },
              Role: {
                every: { role_id: getPermissionsByRoleDto.role_id },
              },
            },
          },
        },
      },
    });
  }

  update({ permission_id, ...dataUpdate }: UpdatePermissionDto) {
    return this.prismaService.permission.update({
      data: dataUpdate,
      where: {
        permission_id,
      },
    });
  }
  remove(ids: number[]) {
    return this.prismaService.permission.deleteMany({
      where: {
        permission_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const permission = await this.prismaService.permission.findUnique({
      where: { permission_id: id },
      select: {
        permission_id: true,
        permission_name: true,
        permission_description: true,
        group_permission_id: true,
        permission_key: true,
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
        group_permission_id: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
  }: GetPermissionListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.permission.findMany({
      select: {
        permission_id: true,
        permission_name: true,
        permission_description: true,
        permission_key: true,
        GroupPermission: {
          select: {
            group_permission_name: true,
            group_permission_id: true,
          },
        },
      },
      skip,
      take: itemPerPage,
      orderBy: {
        permission_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.permission.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreatePermissionDto) {
    return this.prismaService.permission.create({
      data: {
        ...createDto,
      },
    });
  }

  getOptions(getOptionsDto: GetPermissionOptionsDto) {
    return this.prismaService.permission.findMany({
      select: {
        permission_id: true,
        permission_name: true,
      },
      where: {
        permission_name: {
          contains: getOptionsDto.permission_name,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
}
