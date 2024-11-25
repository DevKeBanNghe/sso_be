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
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import {
  GetPermissionListByPaginationDto,
  GetPermissionOptionsDto,
} from './dto/get-permission.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';
import { Permission } from './entities/permission.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createPermission(@Body() createDto: CreatePermissionDto) {
    return this.permissionService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updatePermission(@Body() updateDto: UpdatePermissionDto) {
    return this.permissionService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getPermissionList(
    @Query() getListByPaginationDto: GetPermissionListByPaginationDto
  ) {
    return this.permissionService.getList(getListByPaginationDto);
  }

  @Get('/options')
  @UsePipes(ParseParamsOptionPipe)
  getOptions(@Query() getOptionsDto: GetPermissionOptionsDto) {
    return this.permissionService.getOptions(getOptionsDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getPermissionDetail(@Param('id') id: Permission['permission_id']) {
    return this.permissionService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deletePermissions(@Query('ids') ids: Permission['permission_id'][]) {
    return this.permissionService.remove(ids);
  }
}
