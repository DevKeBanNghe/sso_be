import { Controller, Body, UsePipes, Put, Post } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetRolePermissionListDto } from './dto/get-role-permission.dto';

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
}
