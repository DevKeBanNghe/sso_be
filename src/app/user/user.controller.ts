import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  UsePipes,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiBody({ type: [CreateUserDto] })
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  getAll(@Body() body) {
    // console.log('🚀 ~ UserController ~ getAll ~ body:', body);
    return this.userService.getAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }

  @Delete(':id')
  @UsePipes(ParseIntPipe)
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Delete()
  removeBy(@Query() query) {
    return this.userService.removeBy(query);
  }

  @Get(':id')
  @UsePipes(ParseIntPipe)
  getDetail(@Param('id') id: number) {
    return this.userService.getDetail(id);
  }
}
