import {
  Controller,
  Body,
  UsePipes,
  Put,
  Post,
  Get,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetRolePermissionListDto } from './dto/get-role-permission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Put()
  updateRolePermission(@Body() updateDto: UpdateRolePermissionDto[]) {
    return this.rolePermissionService.update(updateDto);
  }

  @Post()
  @UsePipes(ParseParamsPaginationPipe)
  getRolePermissionList(@Body() params: GetRolePermissionListDto) {
    return this.rolePermissionService.getAll(params);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportRolePermission() {
    const data = await this.rolePermissionService.exportRolePermission();
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importRolePermission(@UploadedFile() file, @Req() req) {
    return this.rolePermissionService.importRolePermission({
      file,
      user: req.user,
    });
  }
}
