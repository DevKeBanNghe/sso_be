import {
  Controller,
  Body,
  UsePipes,
  Put,
  Post,
  UseInterceptors,
  Get,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetUserRoleListDto } from './dto/get-user-role.dto';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Put()
  updateUserRole(@Body() updateDto: UpdateUserRoleDto[]) {
    return this.userRoleService.update(updateDto);
  }

  @Post()
  @UsePipes(ParseParamsPaginationPipe)
  getUserRoleList(@Body() params: GetUserRoleListDto) {
    return this.userRoleService.getAll(params);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportRolePermission() {
    const data = await this.userRoleService.exportUserRole();
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importRolePermission(@UploadedFile() file, @Req() req) {
    return this.userRoleService.importUserRole({
      file,
      user: req.user,
    });
  }
}
