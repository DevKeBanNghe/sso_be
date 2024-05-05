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
} from '@nestjs/common';
import { GroupPermissionService } from './group-permission.service';
import { CreateGroupPermissionDto } from './dto/create-group-permission.dto';
import { UpdateGroupPermissionDto } from './dto/update-group-permission.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import {
  GetGroupPermissionListByPaginationDto,
  GetGroupPermissionOptionsDto,
} from './dto/get-group-permission.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';

@Controller('group-permission')
export class GroupPermissionController {
  constructor(
    private readonly groupPermissionService: GroupPermissionService
  ) {}

  @Get('/options')
  getOptions(@Query() getOptionsDto: GetGroupPermissionOptionsDto) {
    return this.groupPermissionService.getOptions(getOptionsDto);
  }

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createGroupPermission(@Body() createDto: CreateGroupPermissionDto) {
    return this.groupPermissionService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateRole(@Body() updateDto: UpdateGroupPermissionDto) {
    return this.groupPermissionService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getRoleList(
    @Query() getListByPaginationDto: GetGroupPermissionListByPaginationDto
  ) {
    return this.groupPermissionService.getList(getListByPaginationDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getRoleDetail(@Param('id', ParseIntPipe) id: number) {
    return this.groupPermissionService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteRoles(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    return this.groupPermissionService.remove(ids);
  }
}
