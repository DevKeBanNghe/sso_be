import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Put,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import {
  UpdateActivateStatusDto,
  UpdatePermissionDto,
} from './dto/update-permission.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import {
  GetPermissionListByPaginationDto,
  GetPermissionOptionsDto,
} from './dto/get-permission.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';
import { Permission } from '@prisma-postgresql/models';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  createPermission(@Body() createDto: CreatePermissionDto) {
    return this.permissionService.create(createDto);
  }

  @Put()
  updatePermission(@Body() updateDto: UpdatePermissionDto) {
    return this.permissionService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getPermissionList(
    @Query() getListByPaginationDto: GetPermissionListByPaginationDto
  ) {
    return this.permissionService.getList(getListByPaginationDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportPermissions(@Query('ids') ids: Permission['permission_id'][]) {
    const data = await this.permissionService.exportPermissions({ ids });
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importUsers(@UploadedFile() file, @Req() req) {
    return this.permissionService.importPermissions({ file, user: req.user });
  }

  @Get('options')
  @UsePipes(ParseParamsOptionPipe)
  getOptions(@Query() getOptionsDto: GetPermissionOptionsDto) {
    return this.permissionService.getOptions(getOptionsDto);
  }

  @Get('action-options')
  getPermissionActionOptions() {
    return this.permissionService.getPermissionActionOptions();
  }

  @Get('http-method-options')
  getHttpMethodOptions() {
    return this.permissionService.getHttpMethodOptions();
  }

  @Get(':id')
  getPermissionDetail(@Param('id') id: Permission['permission_id']) {
    return this.permissionService.getDetail(id);
  }

  @Delete()
  deletePermissions(@Query('ids') ids: Permission['permission_id'][]) {
    return this.permissionService.remove(ids);
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.permissionService.updateActivateStatus(payload);
  }
}
