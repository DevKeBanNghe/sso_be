import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWebpageDto } from './dto/create-webpage.dto';
import { UpdateWebpageDto } from './dto/update-webpage.dto';
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
  GetWebpageListByPaginationDto,
  GetWebpageOptionsDto,
} from './dto/get-webpage.dto';
import { ApiService } from 'src/common/utils/api/api.service';

@Injectable()
export class WebpageService
  implements
    GetAllService,
    CreateService<CreateWebpageDto>,
    GetOptionsService<GetWebpageOptionsDto>,
    GetDetailService,
    DeleteService,
    UpdateService<UpdateWebpageDto>
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService
  ) {}
  create(createDto: CreateWebpageDto) {
    return this.prismaService.webpage.create({
      data: {
        ...createDto,
      },
    });
  }

  update({ webpage_id, ...dataUpdate }: UpdateWebpageDto) {
    return this.prismaService.webpage.update({
      data: dataUpdate,
      where: {
        webpage_id,
      },
    });
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
    const Webpage = await this.prismaService.webpage.findUnique({
      where: { webpage_id: id },
      select: {
        webpage_id: true,
        webpage_url: true,
        webpage_description: true,
      },
    });
    if (!Webpage) throw new BadRequestException('Group Webpage not found');
    return Webpage;
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

  getOptions(getOptionsDto: GetWebpageOptionsDto) {
    return this.prismaService.webpage.findMany({
      select: {
        webpage_id: true,
        webpage_url: true,
      },
      where: {
        webpage_url: {
          contains: getOptionsDto.webpage_url,
          mode: 'insensitive',
        },
      },
      take: getOptionsDto.limit,
    });
  }
}
