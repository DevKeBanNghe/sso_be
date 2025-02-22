import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWebpageDto } from './dto/create-webpage.dto';
import { UpdateWebpageDto } from './dto/update-webpage.dto';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  GetWebpageListByPaginationDto,
  GetWebpagePermissionsParams,
  IsExistWebpageParams,
} from './dto/get-webpage.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { RoleService } from '../role/role.service';
import { Webpage } from './entities/webpage.entity';
import { BaseInstance } from 'src/common/classes/base.class';
import { QueryUtilService } from 'src/common/utils/query/query-util.service';

@Injectable()
export class WebpageService
  extends BaseInstance
  implements
    GetAllService,
    CreateService<CreateWebpageDto>,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateWebpageDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private roleService: RoleService,
    private queryUtil: QueryUtilService
  ) {
    super();
  }

  get instance() {
    return this.prismaService.webpage;
  }

  get extended() {
    return this.prismaService.clientExtended.webpage;
  }

  async create({ role_ids, ...createDto }: CreateWebpageDto) {
    const webpageData = await this.prismaService.clientExtended.webpage.create({
      data: {
        ...createDto,
      },
    });

    await this.roleService.updateWebpage({
      webpage_id: webpageData.webpage_id,
      role_ids,
    });
    return webpageData;
  }

  async update({ webpage_id, role_ids, ...dataUpdate }: UpdateWebpageDto) {
    const webpageData = await this.prismaService.clientExtended.webpage.update({
      data: dataUpdate,
      where: {
        webpage_id,
      },
    });

    await this.roleService.updateWebpage({ webpage_id, role_ids });
    return webpageData;
  }
  remove(ids: Webpage['webpage_id'][]) {
    return this.prismaService.webpage.deleteMany({
      where: {
        webpage_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: Webpage['webpage_id']) {
    const webpageData = await this.prismaService.webpage.findFirst({
      where: { webpage_id: id },
      select: {
        webpage_id: true,
        webpage_url: true,
        webpage_description: true,
        webpage_key: true,
        webpage_name: true,
        roles: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
      },
    });
    if (!webpageData) throw new BadRequestException('Webpage not found');
    const { roles = [], ...webpage } = webpageData;
    return { ...webpage, role_ids: roles.map((item) => item.role_id) };
  }

  getList(getWebpageListByPaginationDto: GetWebpageListByPaginationDto) {
    if (!getWebpageListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getWebpageListByPaginationDto);
  }
  getAll() {
    return this.prismaService.webpage.findMany({
      select: {
        webpage_id: true,
        webpage_url: true,
        webpage_description: true,
      },
    });
  }

  async getListByPagination({
    page,
    itemPerPage,
    search = '',
  }: GetWebpageListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const fieldsSelectDefault = {
      webpage_id: true,
      webpage_url: true,
      webpage_key: true,
      webpage_description: true,
    };
    const searchQuery = this.queryUtil.buildSearchQuery({
      keys: fieldsSelectDefault,
      value: search,
    });

    const list = await this.prismaService.clientExtended.webpage.findMany({
      select: {
        ...fieldsSelectDefault,
        roles: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
      },
      where: {
        OR: searchQuery,
      },
      skip,
      take: itemPerPage,
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.webpage.count(),
      page,
      itemPerPage,
    });
  }

  async getWhiteList() {
    const data = await this.getAll();
    return data.map((item) => item.webpage_url);
  }

  async isExistWebpage({ webpage_key }: IsExistWebpageParams) {
    const data = await this.prismaService.clientExtended.webpage.findFirst({
      select: {
        webpage_id: true,
        webpage_name: true,
        webpage_url: true,
      },
      where: { webpage_key },
    });
    return data ? true : false;
  }

  async getWebpagePermissions({
    webpage_key,
    permission_router,
    httpMethod,
  }: GetWebpagePermissionsParams) {
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

    const rolesData = await this.prismaService.webpage.findFirst({
      select: {
        roles: {
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
      where: {
        webpage_key,
      },
    });

    if (!rolesData) return [];
    const data = rolesData.roles.reduce<Record<string, string[]>[]>(
      (acc, { permissions, children: rolesChildren }) => {
        const permissionData = permissions.reduce(
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
        const permissionChildrenData = rolesChildren.reduce(
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
}
