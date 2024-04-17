import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { ConditionDto } from './dto/get-user.dto';
import { PrismaOperator } from 'src/consts/prisma.const';
import {
  CreateService,
  DeleteService,
  GetAllService,
  GetDetailService,
} from 'src/common/interfaces/service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService
  implements
    CreateService<CreateUserDto>,
    GetAllService,
    DeleteService,
    GetDetailService
{
  constructor(private prisma: PrismaService) {}
  getDetail(id: number) {
    return this.getFirstBy({ user_id: id });
  }
  async remove(id: number) {
    const user = await this.getDetail(id);
    if (!user) throw new BadRequestException('User not found');

    return this.prisma.user.delete({
      where: {
        user_id: id,
      },
    });
  }
  async getAll() {
    return await this.prisma.user.findMany();
  }
  async create(createDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createDto,
      },
    });
  }

  getFirstBy(
    condition: ConditionDto | ConditionDto[],
    operator: PrismaOperator = PrismaOperator.OR
  ) {
    if (!Array.isArray(condition))
      return this.prisma.user.findFirst({
        where: {
          ...condition,
        },
      });

    return this.prisma.user.findFirst({
      where: {
        [operator]: condition,
      },
    });
  }

  async removeBy(deleteUserDto: DeleteUserDto) {
    const user = await this.getFirstBy(deleteUserDto);
    if (!user) throw new BadRequestException('User not found');
    return this.prisma.user.delete({
      where: {
        ...user,
      },
    });
  }
}
