import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Webpage, Permission } from '@prisma-postgresql/models';
import { PaginationList } from 'src/common/classes/pagination-list.class';
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
class GetDetailByParams extends PickType(Webpage, ['webpage_key']) {}

class ExportWebpagesDto {
  ids: Webpage['webpage_id'][];
}

export {
  IsExistWebpageParams,
  GetWebpageListByPaginationDto,
  GetWebpagePermissionsParams,
  GetDetailByParams,
  ExportWebpagesDto,
};
