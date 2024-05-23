import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  GetRoleListByPaginationDto,
  GetRoleOptionsDto,
} from './dto/get-role.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { UpdateRoleDto, UpdateWebpageDto } from './dto/update-role.dto';

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

  removeRoleChildren(role_parent_ids: number[]) {
    return this.prismaService.role.updateMany({
      data: {
        role_parent_id: null,
      },
      where: {
        role_parent_id: {
          in: role_parent_ids,
        },
      },
    });
  }
  async remove(ids: number[]) {
    await this.removeRoleChildren(ids);
    return await this.prismaService.role.deleteMany({
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
        role_parent_id: true,
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
    const fieldsSelectDefault = {
      role_id: true,
      role_name: true,
      role_description: true,
    };
    const list = await this.prismaService.role.findMany({
      select: {
        ...fieldsSelectDefault,
        children: {
          select: {
            ...fieldsSelectDefault,
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
      list: list.map((item) => ({
        ...item,
        children: item.children.length
          ? item.children.map((child) => ({
              ...child,
              key: `role_child_${child.role_id}`,
            }))
          : null,
      })),
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

  private async removeWebpageExist(webpage_id: number) {
    return this.prismaService.role.updateMany({
      data: {
        webpage_id: null,
      },
      where: {
        webpage_id,
      },
    });
  }

  async updateWebpage({ webpage_id, role_ids }: UpdateWebpageDto) {
    await this.removeWebpageExist(webpage_id);
    return this.prismaService.role.updateMany({
      data: {
        webpage_id,
      },
      where: {
        role_id: {
          in: role_ids,
        },
      },
    });
  }
}
