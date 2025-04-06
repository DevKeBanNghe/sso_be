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
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  CreateUsersSubscribeWebpageDto,
} from './dto/create-user.dto';
import { UpdateActivateStatusDto, UpdateUserDto } from './dto/update-user.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetUserListByPaginationDto } from './dto/get-user.dto';
import { User } from '@prisma-postgresql/models';
import { Request } from 'src/common/interfaces/http.interface';
import { HttpHeaders } from 'src/consts/enum.const';
import { ApiService } from 'src/common/utils/api/api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) {}

  @Get('info')
  getUserInfo(@Req() req: Request) {
    const user = req.user;
    const user_id = user.user_id;
    if (!user_id) throw new UnauthorizedException();

    const isUserActive = this.userService.isUserActive(user_id);
    if (!isUserActive) throw new UnauthorizedException();
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

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportUsers(@Query('ids') ids: User['user_id'][]) {
    const data = await this.userService.exportUsers({ ids });
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUsers(@UploadedFile() file, @Req() req) {
    return this.userService.importUsers({ file, user: req.user });
  }

  @Get(':id')
  getUserDetail(@Param('id') id: User['user_id']) {
    return this.userService.getDetail(id);
  }

  @Delete()
  deleteUsers(@Query('ids') ids: User['user_id'][]) {
    return this.userService.remove(ids);
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.userService.updateActivateStatus(payload);
  }

  @Get('/subscribe-webpage')
  getUsersSubscribeWebpage(@Req() req: Request) {
    const webpage_key = this.apiService.getHeadersParam({
      key: HttpHeaders.WEBPAGE_KEY,
      headers: req.headers,
    });
    return this.userService.getUsersSubscribeWebpage({ webpage_key });
  }

  @Post('subscribe')
  createUsersSubscribeWebpage(
    @Req() req: Request,
    @Body() payload: CreateUsersSubscribeWebpageDto
  ) {
    const webpage_key = this.apiService.getHeadersParam({
      key: HttpHeaders.WEBPAGE_KEY,
      headers: req.headers,
    });
    return this.userService.createUsersSubscribeWebpage({
      webpage_key,
      ...payload,
    });
  }
}
