import {
  Controller,
  Get,
  Body,
  Delete,
  UsePipes,
  Query,
  UnauthorizedException,
  Post,
  Put,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetUserListByPaginationDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getUserInfo(@Body() body) {
    const user = body.user;
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @Post()
  createUser(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Put()
  updateUser(@Body() updateDto: UpdateUserDto) {
    return this.userService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getUserList(@Query() getListByPaginationDto: GetUserListByPaginationDto) {
    return this.userService.getList(getListByPaginationDto);
  }

  @Get(':id')
  getUserDetail(@Param('id') id: User['user_id']) {
    return this.userService.getDetail(id);
  }

  @Delete()
  deleteUsers(@Query('ids') ids: User['user_id'][]) {
    return this.userService.remove(ids);
  }
}
