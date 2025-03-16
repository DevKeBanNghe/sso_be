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
import {
  UpdateActivateStatusDto,
  UpdateRoleDto,
  UpdateWebpageDto,
} from './dto/update-role.dto';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';
import { isEmpty } from 'lodash';
import { Role, Webpage } from '@prisma-postgresql/models';

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
    private apiService: ApiService,
    private queryUtil: QueryUtilService
  ) {}
  getOptions(getOptionsDto: GetRoleOptionsDto) {
    const { limit, search = '' } = getOptionsDto ?? {};
    const fieldsSelect = {
      role_id: true,
      role_name: true,
    };
    const searchQuery = this.queryUtil.buildSearchQuery({
      keys: fieldsSelect,
      value: search,
    });
    return this.prismaService.role.findMany({
      select: fieldsSelect,
      where: {
        OR: searchQuery,
      },
      take: limit,
    });
  }
  update({ role_id, ...dataUpdate }: UpdateRoleDto) {
    return this.prismaService.clientExtended.role.update({
      data: dataUpdate,
      where: {
        role_id,
      },
    });
  }

  removeRoleChildren(role_parent_ids: Role['role_parent_id'][]) {
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
  async remove(ids: Role['role_id'][]) {
    await this.removeRoleChildren(ids);
    return await this.prismaService.clientExtended.role.softDelete({
      role_id: {
        in: ids,
      },
    });
  }
  async getDetail(id: Role['role_id']) {
    const role = await this.prismaService.role.findFirst({
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

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetRoleListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const fieldsSelectDefault = {
      role_id: true,
      role_name: true,
      role_description: true,
    };
    const searchQuery = this.queryUtil.buildSearchQuery({
      keys: fieldsSelectDefault,
      value: search,
    });
    const list = await this.prismaService.clientExtended.role.findMany({
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
      list: list.map(({ children, ...itemRemain }) => ({
        ...itemRemain,
        children: isEmpty(children)
          ? null
          : children.map((child) => ({
              ...child,
              key: `role_child_${child.role_id}`,
            })),
      })),
      totalItems: await this.prismaService.role.count(),
      page,
      itemPerPage,
    });
  }
  create(createDto: CreateRoleDto) {
    return this.prismaService.clientExtended.role.create({
      data: {
        ...createDto,
      },
    });
  }

  private async removeWebpageExist(webpage_id: Webpage['webpage_id']) {
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

  updateActivateStatus({ role_ids, ...dataUpdate }: UpdateActivateStatusDto) {
    return this.prismaService.clientExtended.role.updateMany({
      data: dataUpdate,
      where: {
        role_id: {
          in: role_ids,
        },
      },
    });
  }
}
