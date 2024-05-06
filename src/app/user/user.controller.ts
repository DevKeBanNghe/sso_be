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
} from '@nestjs/common';
import { UserService } from './user.service';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  getUserInfo(@Body() body) {
    const user = body[KEY_FROM_DECODED_TOKEN];
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
