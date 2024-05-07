import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  UsePipes,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetUserListByPaginationDto } from './dto/get-user.dto';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  getUserInfo(@Body() body) {
    const user = body[KEY_FROM_DECODED_TOKEN];
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createUser(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateUser(@Body() updateDto: UpdateUserDto) {
    return this.userService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getUserList(@Query() getListByPaginationDto: GetUserListByPaginationDto) {
    return this.userService.getList(getListByPaginationDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getUserDetail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteUsers(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    return this.userService.remove(ids);
  }
}
