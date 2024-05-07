import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';
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
  GetGroupRoleListByPaginationDto,
  GetGroupRoleOptionsDto,
} from './dto/get-group-role.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { GroupPermissionService } from '../group-permission/group-permission.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class GroupRoleService
  implements
    GetAllService,
    CreateService<CreateGroupRoleDto>,
    GetOptionsService<GetGroupRoleOptionsDto>,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateGroupRoleDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private groupPermissionService: GroupPermissionService,
    private roleService: RoleService
  ) {}
  async create({
    group_permission_ids,
    role_ids,
    ...dataCreate
  }: CreateGroupRoleDto) {
    const dataGroupRole = await this.prismaService.groupRole.create({
      data: {
        ...dataCreate,
      },
    });
    await this.groupPermissionService.updateGroupRole({
      group_role_id: dataGroupRole.group_role_id,
      group_permission_ids,
    });
    await this.roleService.updateGroupRole({
      group_role_id: dataGroupRole.group_role_id,
      role_ids,
    });
    return dataGroupRole;
  }

  async update({
    group_role_id,
    group_permission_ids,
    role_ids,
    ...dataUpdate
  }: UpdateGroupRoleDto) {
    const dataGroupRole = await this.prismaService.groupRole.update({
      data: dataUpdate,
      where: {
        group_role_id,
      },
    });
    await this.groupPermissionService.updateGroupRole({
      group_role_id: dataGroupRole.group_role_id,
      group_permission_ids,
    });
    await this.roleService.updateGroupRole({
      group_role_id: dataGroupRole.group_role_id,
      role_ids,
    });

    return dataGroupRole;
  }
  remove(ids: number[]) {
    return this.prismaService.groupRole.deleteMany({
      where: {
        group_role_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const groupRole = await this.prismaService.groupRole.findUnique({
      where: { group_role_id: id },
      select: {
        group_role_id: true,
        group_role_name: true,
        group_role_description: true,
        group_role_parent_id: true,
        webpage_id: true,
        GroupPermission: {
          select: {
            group_permission_id: true,
          },
        },
        Role: {
          select: {
            role_id: true,
          },
        },
      },
    });
    if (!groupRole) throw new BadRequestException('Group Role not found');
    const { GroupPermission, Role, ...groupRoleDetail } = groupRole;
    return {
      ...groupRoleDetail,
      group_permission_ids: GroupPermission.map(
        (item) => item.group_permission_id
      ),
      role_ids: Role.map((item) => item.role_id),
    };
  }

  getList(getGroupRoleListByPaginationDto: GetGroupRoleListByPaginationDto) {
    if (!getGroupRoleListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getGroupRoleListByPaginationDto);
  }
  getAll() {
    return this.prismaService.groupRole.findMany({
      select: {
        group_role_id: true,
        group_role_name: true,
        group_role_description: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
  }: GetGroupRoleListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.groupRole.findMany({
      select: {
        group_role_id: true,
        group_role_name: true,
        group_role_description: true,
        GroupPermission: {
          select: {
            group_permission_id: true,
            group_permission_name: true,
          },
        },
        Role: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
      },
      skip,
      take: itemPerPage,
      orderBy: {
        group_role_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.groupRole.count(),
      page,
      itemPerPage,
    });
  }

  getOptions(getOptionsDto: GetGroupRoleOptionsDto) {
    return this.prismaService.groupRole.findMany({
      select: {
        group_role_id: true,
        group_role_name: true,
      },
      where: {
        group_role_name: {
          contains: getOptionsDto.group_role_name,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
}
