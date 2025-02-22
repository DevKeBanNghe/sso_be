import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Webpage } from '../entities/webpage.entity';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Permission } from 'src/app/permission/entities/permission.entity';
import { HttpMethod } from 'src/common/interfaces/http.interface';

class GetWebpageListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Webpage)
) {}

class IsExistWebpageParams extends PickType(Webpage, ['webpage_key']) {}

class GetWebpagePermissionsParams extends IntersectionType(
  PickType(Webpage, ['webpage_key']),
  PickType(Permission, ['permission_router'])
) {
  httpMethod: HttpMethod;
}

export {
  IsExistWebpageParams,
  GetWebpageListByPaginationDto,
  GetWebpagePermissionsParams,
};
