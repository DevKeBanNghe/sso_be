import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
  GetInstanceService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiService } from 'src/common/utils/api/api.service';
import { GetUserListByPaginationDto } from './dto/get-user.dto';

@Injectable()
export class UserService
  implements
    CreateService<CreateUserDto>,
    UpdateService<UpdateUserDto>,
    GetAllService,
    GetDetailService,
    DeleteService,
    GetInstanceService
{
  constructor(
    private prismaService: PrismaService,
    private apiService: ApiService
  ) {}

  private readonly KEY_SYSTEM: string = 'SYS_ALL';

  remove(ids: number[]) {
    return this.prismaService.user.deleteMany({
      where: {
        user_id: {
          in: ids,
        },
      },
    });
  }
  async getDetail(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        user_name: true,
        role_id: true,
      },
    });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  getList(getListByPaginationDto: GetUserListByPaginationDto) {
    if (!getListByPaginationDto.page) return this.getAll();
    return this.getListByPagination(getListByPaginationDto);
  }
  getAll() {
    return this.prismaService.user.findMany({
      select: {
        user_id: true,
        user_name: true,
      },
    });
  }

  async getListByPagination({ page, itemPerPage }: GetUserListByPaginationDto) {
    const skip = (page - 1) * itemPerPage;
    const list = await this.prismaService.user.findMany({
      select: {
        user_id: true,
        user_name: true,
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
        user_id: 'desc',
      },
    });

    return this.apiService.formatPagination<typeof list>({
      list,
      totalItems: await this.prismaService.user.count(),
      page,
      itemPerPage,
    });
  }

  getInstance() {
    return this.prismaService.user;
  }

  update(updateDto: UpdateUserDto) {
    const { user_id, ...dataUpdate } = updateDto;
    return this.prismaService.user.update({
      where: { user_id },
      data: dataUpdate,
    });
  }

  async create(createDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: {
        ...createDto,
      },
    });
  }

  async getRoutersPermission(user_id: number) {
    const defaultSelect = {
      RolePermission: {
        select: {
          Permission: {
            select: {
              permission_router: true,
            },
          },
        },
      },
    };
    const data = await this.prismaService.user.findFirst({
      select: {
        Role: {
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
        user_id,
      },
    });

    if (!data) return [];
    const { Role } = data;
    const { RolePermission = [], children = [] } = Role ?? {};
    const permissionRouter = RolePermission.map(
      (item) => item.Permission.permission_router
    );
    const permissionRouterChildren = children.reduce(
      (acc, { RolePermission }) =>
        acc.concat(
          RolePermission.map((item) => item.Permission.permission_router)
        ),
      []
    );
    return [...permissionRouter, ...permissionRouterChildren];
  }

  async isAdmin(user_id: number) {
    const routersPermission = await this.prismaService.user.findFirst({
      where: {
        user_id,
        Role: {
          RolePermission: {
            some: {
              Permission: {
                permission_key: this.KEY_SYSTEM,
              },
            },
          },
        },
      },
    });
    return routersPermission ? true : false;
  }
}
