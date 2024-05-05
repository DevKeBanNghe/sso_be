import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Put,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { GroupRoleService } from './group-role.service';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import {
  GetGroupRoleListByPaginationDto,
  GetGroupRoleOptionsDto,
} from './dto/get-group-role.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';

@Controller('group-role')
export class GroupRoleController {
  constructor(private readonly groupRoleService: GroupRoleService) {}

  @Get('/options')
  getOptions(@Body() getOptionsDto: GetGroupRoleOptionsDto) {
    return this.groupRoleService.getOptions(getOptionsDto);
  }

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createGroupRole(@Body() createDto: CreateGroupRoleDto) {
    return this.groupRoleService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateRole(@Body() updateDto: UpdateGroupRoleDto) {
    return this.groupRoleService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getRoleList(
    @Query() getListByPaginationDto: GetGroupRoleListByPaginationDto
  ) {
    return this.groupRoleService.getList(getListByPaginationDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getRoleDetail(@Param('id', ParseIntPipe) id: number) {
    return this.groupRoleService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteRoles(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    return this.groupRoleService.remove(ids);
  }
}
