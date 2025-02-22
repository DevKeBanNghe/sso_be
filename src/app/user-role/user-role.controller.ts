import { Controller, Body, UsePipes, Put, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { GetUserRoleListDto } from './dto/get-user-role.dto';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Put()
  updateUserRole(@Body() updateDto: UpdateUserRoleDto[]) {
    return this.userRoleService.update(updateDto);
  }

  @Post()
  @UsePipes(ParseParamsPaginationPipe)
  getUserRoleList(@Body() params: GetUserRoleListDto) {
    return this.userRoleService.getAll(params);
  }
}
