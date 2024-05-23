import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import {
  GetRoleListByPaginationDto,
  GetRoleOptionsDto,
} from './dto/get-role.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createRole(@Body() createDto: CreateRoleDto) {
    return this.roleService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateRole(@Body() updateDto: UpdateRoleDto) {
    return this.roleService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getRoleList(@Query() getListByPaginationDto: GetRoleListByPaginationDto) {
    return this.roleService.getList(getListByPaginationDto);
  }

  @Get('/options')
  @UsePipes(ClearDecodedDataPipe)
  getRoleOptions(@Query() getOptionsDto?: GetRoleOptionsDto) {
    return this.roleService.getOptions(getOptionsDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getRoleDetail(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteRoles(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    return this.roleService.remove(ids);
  }
}
