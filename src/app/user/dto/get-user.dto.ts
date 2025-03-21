import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Prisma } from '@prisma/postgresql_client';
import { DefaultArgs } from '@prisma/postgresql_client/runtime/library';
import { HttpMethod } from 'src/common/interfaces/http.interface';
import { Permission, User, Webpage } from '@prisma-postgresql/models';

class GetUserListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(User)
) {}

class GetUserByIDParams {
  user_id: User['user_id'];
  select: Prisma.UserSelect<DefaultArgs>;
}

class GetUserPermissionsParams extends IntersectionType(
  PickType(User, ['user_id']),
  PickType(Permission, ['permission_router'])
) {
  httpMethod: HttpMethod;
}

class GetUsersSubscribeWebpageDto extends PickType(Webpage, ['webpage_key']) {}

class GetUserByParams extends PickType(User, ['user_email']) {}

export {
  GetUserListByPaginationDto,
  GetUserByIDParams,
  GetUserPermissionsParams,
  GetUsersSubscribeWebpageDto,
  GetUserByParams,
};
