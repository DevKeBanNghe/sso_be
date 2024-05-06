import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import {
  CreateService,
  UpdateService,
} from 'src/common/interfaces/service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService
  implements CreateService<CreateUserDto>, UpdateService<UpdateUserDto>
{
  constructor(private prisma: PrismaService) {}

  getInstance() {
    return this.prisma.user;
  }

  update(updateDto: UpdateUserDto) {
    const { user_id, ...dataUpdate } = updateDto;
    return this.prisma.user.update({
      where: { user_id },
      data: dataUpdate,
    });
  }

  async create(createDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createDto,
      },
    });
  }
}
