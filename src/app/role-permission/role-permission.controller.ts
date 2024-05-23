import { Controller, Get, Body, UsePipes, Put } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateRolePermission(@Body() updateDto: UpdateRolePermissionDto[]) {
    return this.rolePermissionService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getRolePermissionList() {
    return this.rolePermissionService.getAll();
  }
}
