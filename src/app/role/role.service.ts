import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateRoleDto } from './dto/create-group-role.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  GetRoleListByPaginationDto,
  GetRoleOptionsDto,
} from './dto/get-role.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { UpdateGroupRoleDto, UpdateRoleDto } from './dto/update-group-role.dto';

@Injectable()
export class RoleService
  implements
    CreateService<CreateRoleDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateRoleDto>,
    GetOptionsService<GetRoleOptionsDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService
  ) {}
  getOptions(getOptionsDto?: GetRoleOptionsDto) {
    return this.prismaService.role.findMany({
      select: {
        role_id: true,
        role_name: true,
      },
      where: {
        role_name: {
          contains: getOptionsDto.role_name,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
  update({ role_id, ...dataUpdate }: UpdateRoleDto) {
    return this.prismaService.role.update({
      data: dataUpdate,
      where: {
        role_id,
      },
    });
  }
  remove(ids: number[]) {
    return this.prismaService.role.deleteMany({
      where: {
        role_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const role = await this.prismaService.role.findUnique({
      where: { role_id: id },
      select: {
        role_id: true,
        role_name: true,
        role_description: true,
        group_role_id: true,
        role_is_all_permissions: true,
      },
    });
    if (!role) throw new BadRequestException('Role not found');
    return role;
  }

  getList(getRoleListByPaginationDto: GetRoleListByPaginationDto) {
    if (!getRoleListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getRoleListByPaginationDto);
  }
  getAll() {
    return this.prismaService.role.findMany({
      select: {
        role_id: true,
        role_name: true,
        role_description: true,
      },
    });
  }

  async getListByPagination({ page, itemPerPage }: GetRoleListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.role.findMany({
      select: {
        role_id: true,
        role_name: true,
        role_description: true,
        GroupRole: {
          select: {
            group_role_id: true,
            group_role_name: true,
          },
        },
      },
      skip,
      take: itemPerPage,
      orderBy: {
        role_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.role.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreateRoleDto) {
    return this.prismaService.role.create({
      data: {
        ...createDto,
      },
    });
  }

  private async removeGroupRoleExist(group_role_id: number) {
    return this.prismaService.role.updateMany({
      data: {
        group_role_id: null,
      },
      where: {
        group_role_id,
      },
    });
  }

  async updateGroupRole({ group_role_id, role_ids }: UpdateGroupRoleDto) {
    await this.removeGroupRoleExist(group_role_id);
    return this.prismaService.role.updateMany({
      data: {
        group_role_id,
      },
      where: {
        role_id: {
          in: role_ids,
        },
      },
    });
  }
}
