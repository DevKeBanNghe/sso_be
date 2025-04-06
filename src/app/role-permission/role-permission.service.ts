import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import {
  GetAllService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetRolePermissionListDto } from './dto/get-role-permission.dto';
import { BaseInstance } from 'src/common/classes/base.class';
import { isEmpty, startCase, upperCase } from 'lodash';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';
import { ImportRolePermissionDto } from './dto/create-role-permission.dto';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RolePermissionService
  extends BaseInstance
  implements GetAllService, UpdateService<UpdateRolePermissionDto>
{
  private excelSheets = {
    RolePermission: 'RolePermission',
  };
  constructor(
    private prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {
    super();
  }

  get instance() {
    return this.prismaService.rolePermission;
  }
  get extended() {
    return this.prismaService.clientExtended.rolePermission;
  }

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

  async getAll(params: GetRolePermissionListDto) {
    const { permission_id_role_id_list } = params ?? {};
    const whereCondition = {};
    if (permission_id_role_id_list) {
      whereCondition['OR'] = permission_id_role_id_list;
    }

    const rolePermissionData = await this.prismaService.rolePermission.findMany(
      { where: whereCondition }
    );

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

  async exportRolePermission() {
    const data = await this.instance.findMany({
      select: {
        permission: {
          select: {
            permission_name: true,
          },
        },
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });

    const excelData = data.reduce(
      (acc, { permission: { permission_name }, role: { role_name } }) => {
        const permissionNameCurrent = acc[permission_name];
        if (permissionNameCurrent) {
          permissionNameCurrent.push(role_name);
        } else {
          acc[permission_name] = [role_name];
        }
        return acc;
      },
      {}
    );

    const permissions = await this.permissionService.instance.findMany({
      select: { permission_name: true },
      where: { permission_name: { notIn: Object.keys(excelData) } },
    });
    for (const { permission_name } of permissions) {
      excelData[permission_name] = [];
    }

    const roles = await this.roleService.instance.findMany({
      select: { role_name: true },
      where: { role_name: { notIn: Object.values<any>(excelData).flat() } },
    });
    excelData[''] = roles.map(({ role_name }) => role_name);

    const dataBuffer = await this.excelUtilService.generateExcelScrollInfinity({
      worksheets: [
        {
          sheetName: this.excelSheets.RolePermission,
          data: excelData,
        },
      ],
    });

    return dataBuffer;
  }

  async importRolePermission({ file }: ImportRolePermissionDto) {
    const dataExcel = await this.excelUtilService.readScrollInfinity({
      file,
    });

    if (isEmpty(dataExcel))
      throw new BadRequestException('Import RolePermission failed!');

    const dataCreated = Object.entries<[string, string]>(
      dataExcel[this.excelSheets.RolePermission]
    );
    const permission_id_role_id_list = [];
    const permission_ids = [];
    for (const [permission_name, role_name_list] of dataCreated) {
      const permission = await this.prismaService.permission.findFirst({
        select: { permission_id: true },
        where: {
          OR: [{ permission_name }, { permission_key: permission_name }],
        },
      });
      let permission_id = permission?.permission_id;
      if (!permission_id) {
        const permissionCreated = await this.prismaService.permission.create({
          data: {
            permission_name,
            permission_key: startCase(upperCase(permission_name)).replace(
              ' ',
              '_'
            ),
          },
          select: {
            permission_id: true,
          },
        });
        permission_id = permissionCreated.permission_id;
      }

      permission_ids.push(permission_id);
      for (const role_name of role_name_list) {
        const role = await this.prismaService.role.findFirst({
          select: { role_id: true },
          where: { role_name },
        });

        let role_id = role?.role_id;
        if (!role_id) {
          const roleCreated = await this.prismaService.role.create({
            data: { role_name },
            select: {
              role_id: true,
            },
          });
          role_id = roleCreated.role_id;
        }
        permission_id_role_id_list.push({ permission_id, role_id });
      }
    }

    await this.prismaService.$transaction([
      this.instance.deleteMany({
        where: {
          permission_id: {
            in: permission_ids,
          },
        },
      }),
      this.instance.createMany({
        data: permission_id_role_id_list,
      }),
    ]);
  }
}
