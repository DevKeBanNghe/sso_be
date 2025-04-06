import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import {
  GetAllService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { GetUserRoleListDto } from './dto/get-user-role.dto';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { ExcelUtilService } from 'src/common/utils/excel/excel-util.service';
import { BaseInstance } from 'src/common/classes/base.class';
import { isEmpty } from 'lodash';
import { ImportUserRoleDto } from './dto/create-user-role.dto';

@Injectable()
export class UserRoleService
  extends BaseInstance
  implements GetAllService, UpdateService<UpdateUserRoleDto>
{
  private excelSheets = {
    UserRole: 'UserRole',
  };
  constructor(
    private prismaService: PrismaService,
    private excelUtilService: ExcelUtilService,
    private userService: UserService,
    private roleService: RoleService
  ) {
    super();
  }

  get instance() {
    return this.prismaService.userRole;
  }
  get extended() {
    return this.prismaService.clientExtended.userRole;
  }

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

  async exportUserRole() {
    const data = await this.instance.findMany({
      select: {
        user: {
          select: {
            user_name: true,
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
      (acc, { user: { user_name }, role: { role_name } }) => {
        const userNameCurrent = acc[user_name];
        if (userNameCurrent) {
          userNameCurrent.push(role_name);
        } else {
          acc[user_name] = [role_name];
        }
        return acc;
      },
      {}
    );

    const users = await this.userService.instance.findMany({
      select: { user_name: true },
      where: { user_name: { notIn: Object.keys(excelData) } },
    });
    for (const { user_name } of users) {
      excelData[user_name] = [];
    }

    const roles = await this.roleService.instance.findMany({
      select: { role_name: true },
      where: { role_name: { notIn: Object.values<any>(excelData).flat() } },
    });
    excelData[''] = roles.map(({ role_name }) => role_name);

    const dataBuffer = await this.excelUtilService.generateExcelScrollInfinity({
      worksheets: [
        {
          sheetName: this.excelSheets.UserRole,
          data: excelData,
        },
      ],
    });

    return dataBuffer;
  }

  async importUserRole({ file }: ImportUserRoleDto) {
    const dataExcel = await this.excelUtilService.readScrollInfinity({
      file,
    });

    if (isEmpty(dataExcel))
      throw new BadRequestException('Import UserRole failed!');

    const dataCreated = Object.entries<[string, string]>(
      dataExcel[this.excelSheets.UserRole]
    );
    const user_id_role_id_list = [];
    const user_ids = [];
    for (const [user_name, role_name_list] of dataCreated) {
      const user = await this.prismaService.user.findFirst({
        select: { user_id: true },
        where: { user_name },
      });
      let user_id = user?.user_id;
      if (!user_id) {
        const userCreated = await this.prismaService.user.create({
          data: {
            user_name,
          },
          select: {
            user_id: true,
          },
        });
        user_id = userCreated.user_id;
      }

      user_ids.push(user_id);
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
        user_id_role_id_list.push({ user_id, role_id });
      }
    }

    await this.prismaService.$transaction([
      this.instance.deleteMany({
        where: {
          user_id: {
            in: user_ids,
          },
        },
      }),
      this.instance.createMany({
        data: user_id_role_id_list,
      }),
    ]);
  }
}
