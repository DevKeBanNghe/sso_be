import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { UpdateRoleDto } from './dto/update-role.dto';
import { ParseParamsOptionPipe } from 'src/common/pipes/parse-params-option.pipe';
import { Role } from './entities/role.entity';

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
  @UsePipes(ParseParamsOptionPipe)
  getRoleOptions(@Query() getOptionsDto?: GetRoleOptionsDto) {
    return this.roleService.getOptions(getOptionsDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getRoleDetail(@Param('id') id: Role['role_id']) {
    return this.roleService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteRoles(@Query('ids') ids: Role['role_id'][]) {
    return this.roleService.remove(ids);
  }
}
