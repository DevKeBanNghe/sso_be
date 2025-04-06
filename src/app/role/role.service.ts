import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetOptionsService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateRoleDto, ImportRolesDto } from './dto/create-role.dto';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  ExportRolesDto,
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
import { isEmpty, isEqual, uniqWith } from 'lodash';
import { Role, Webpage } from '@prisma-postgresql/models';
import { BaseInstance } from 'src/common/classes/base.class';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';

@Injectable()
export class RoleService
  extends BaseInstance
  implements
    CreateService<CreateRoleDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateRoleDto>,
    GetOptionsService<GetRoleOptionsDto>
{
  private excelSheets = {
    Roles: 'Roles',
  };
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private queryUtil: QueryUtilService,
    private excelUtilService: ExcelUtilService
  ) {
    super();
  }

  get instance() {
    return this.prismaService.role;
  }
  get extended() {
    return this.prismaService.clientExtended.role;
  }

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

  private async getRolesExport({ ids }) {
    if (isEmpty(ids)) return await this.getAll();
    return await this.extended.findMany({
      select: {
        role_name: true,
      },
      where: {
        role_id: { in: ids },
      },
    });
  }

  async exportRoles({ ids }: ExportRolesDto) {
    const data = await this.getRolesExport({ ids });
    const dataBuffer = await this.excelUtilService.generateExcel({
      worksheets: [
        {
          sheetName: this.excelSheets.Roles,
          data,
        },
      ],
    });

    return dataBuffer;
  }

  async importRoles({ file, user }: ImportRolesDto) {
    const dataCreated = await this.excelUtilService.read({ file });
    if (isEmpty(dataCreated))
      throw new BadRequestException('Import Roles failed!');
    const data = await this.extended.createMany({
      data: uniqWith<Role>(dataCreated[this.excelSheets.Roles], isEqual).map(
        (item) => ({
          ...item,
          user,
        })
      ),
    });
    return data;
  }
}
