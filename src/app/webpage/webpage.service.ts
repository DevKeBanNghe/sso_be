import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWebpageDto } from './dto/create-webpage.dto';
import { UpdateWebpageDto } from './dto/update-webpage.dto';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetInstanceService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetWebpageListByPaginationDto } from './dto/get-webpage.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class WebpageService
  implements
    GetAllService,
    CreateService<CreateWebpageDto>,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateWebpageDto>,
    GetInstanceService
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService,
    private roleService: RoleService
  ) {}
  getInstance() {
    return this.prismaService.webpage;
  }
  async create({ role_ids, ...createDto }: CreateWebpageDto) {
    const webpageData = await this.prismaService.webpage.create({
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
    const webpageData = await this.prismaService.webpage.update({
      data: dataUpdate,
      where: {
        webpage_id,
      },
    });

    await this.roleService.updateWebpage({ webpage_id, role_ids });
    return webpageData;
  }
  remove(ids: number[]) {
    return this.prismaService.webpage.deleteMany({
      where: {
        webpage_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const webpageData = await this.prismaService.webpage.findUnique({
      where: { webpage_id: id },
      select: {
        webpage_id: true,
        webpage_url: true,
        webpage_description: true,
        webpage_key: true,
        webpage_name: true,
        Role: {
          select: {
            role_id: true,
            role_name: true,
          },
        },
      },
    });
    if (!webpageData) throw new BadRequestException('Webpage not found');
    const { Role = [], ...webpage } = webpageData;
    return { ...webpage, role_ids: Role.map((item) => item.role_id) };
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
  }: GetWebpageListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.webpage.findMany({
      select: {
        webpage_id: true,
        webpage_url: true,
        webpage_description: true,
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
        webpage_id: 'desc',
      },
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
}
