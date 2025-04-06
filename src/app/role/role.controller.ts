import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  GetRoleListByPaginationDto,
  GetRoleOptionsDto,
} from './dto/get-role.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { UpdateActivateStatusDto, UpdateRoleDto } from './dto/update-role.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';
import { Role } from '@prisma-postgresql/models';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelResponseInterceptor } from 'src/common/interceptors/excel-response.interceptor';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createDto: CreateRoleDto) {
    return this.roleService.create(createDto);
  }

  @Put()
  updateRole(@Body() updateDto: UpdateRoleDto) {
    return this.roleService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getRoleList(@Query() getListByPaginationDto: GetRoleListByPaginationDto) {
    return this.roleService.getList(getListByPaginationDto);
  }

  @Get('export')
  @UseInterceptors(ExcelResponseInterceptor)
  async exportRoles(@Query('ids') ids: Role['role_id'][]) {
    const data = await this.roleService.exportRoles({ ids });
    return data;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importRoles(@UploadedFile() file, @Req() req) {
    return this.roleService.importRoles({ file, user: req.user });
  }

  @Get('options')
  @UsePipes(ParseParamsOptionPipe)
  getRoleOptions(@Query() getOptionsDto?: GetRoleOptionsDto) {
    return this.roleService.getOptions(getOptionsDto);
  }

  @Get(':id')
  getRoleDetail(@Param('id') id: Role['role_id']) {
    return this.roleService.getDetail(id);
  }

  @Delete()
  deleteRoles(@Query('ids') ids: Role['role_id'][]) {
    return this.roleService.remove(ids);
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.roleService.updateActivateStatus(payload);
  }
}
