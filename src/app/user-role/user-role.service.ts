import { Injectable } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
  GetAllService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetUserRoleListDto } from './dto/get-user-role.dto';

@Injectable()
export class UserRoleService
  implements GetAllService, UpdateService<UpdateUserRoleDto>
{
  constructor(private prismaService: PrismaService) {}

  async update(updateUserRoleDto: UpdateUserRoleDto[]) {
    for (const { user_id, role_ids } of updateUserRoleDto) {
      await this.prismaService.$transaction([
        this.prismaService.userRole.deleteMany({
          where: { user_id },
        }),
        this.prismaService.userRole.createMany({
          data: role_ids.map((role_id) => ({ role_id, user_id })),
        }),
      ]);
    }

    return {};
  }

  async getAll(params: GetUserRoleListDto) {
    const { user_id_role_id_list } = params ?? {};
    const whereCondition = {};
    if (user_id_role_id_list) {
      whereCondition['OR'] = user_id_role_id_list;
    }

    const userRoleData = await this.prismaService.userRole.findMany({
      where: whereCondition,
    });

    const data = userRoleData.reduce((acc, { user_id, role_id }) => {
      const indexPermissionExist = acc.findIndex(
        (item) => item.user_id === user_id
      );
      if (indexPermissionExist > -1) {
        acc[indexPermissionExist].role_ids.push(role_id);
        return acc;
      }

      return acc.concat({ user_id, role_ids: [role_id] });
    }, []);

    return data;
  }
}
