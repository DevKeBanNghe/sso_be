import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { User, Webpage } from '@prisma-postgresql/models';
import { Request } from 'express';
import { HttpMethod } from 'src/common/interfaces/http.interface';

class CanAccessResourcesParams extends IntersectionType(
  PickType(User, ['user_id']),
  PickType(Webpage, ['webpage_key'])
) {
  currentRoute: string;
  requestMethod: HttpMethod;
}

class GetCurrentRouteParams {
  requestPath: Request['path'];
  requestParams: Request['params'];
}

export { CanAccessResourcesParams, GetCurrentRouteParams };
