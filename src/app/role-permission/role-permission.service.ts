import { Injectable } from '@nestjs/common';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import {
  GetAllService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { groupBy, mapValues, omit } from 'lodash';

@Injectable()
export class RolePermissionService
  implements GetAllService, UpdateService<UpdateRolePermissionDto>
{
  constructor(private prismaService: PrismaService) {}

  async update(updateRolePermissionDto: UpdateRolePermissionDto[]) {
    for (const { permission_id, role_ids } of updateRolePermissionDto) {
      await this.prismaService.$transaction([
        this.prismaService.rolePermission.deleteMany({
          where: { permission_id },
        }),
        this.prismaService.rolePermission.createMany({
          data: role_ids.map((role_id) => ({ role_id, permission_id })),
        }),
      ]);
    }

    return {};
  }

  async getAll(getAllDto?: unknown) {
    const rolePermissionData =
      await this.prismaService.rolePermission.findMany();

    return rolePermissionData.reduce((acc, { permission_id, role_id }) => {
      const indexPermissionExist = acc.findIndex(
        (item) => item.permission_id === permission_id
      );
      if (indexPermissionExist > -1) {
        acc[indexPermissionExist].role_ids.push(role_id);
        return acc;
      }

      return acc.concat({ permission_id, role_ids: [role_id] });
    }, []);
  }
}
