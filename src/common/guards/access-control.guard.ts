import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/app/user/user.service';
import { EnvVars } from 'src/consts';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';
import { ApiService } from '../utils/api/api.service';

@Injectable()
export class AccessControlGuard {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private apiService: ApiService
  ) {}

  getRouteHasParams(req: Request) {
    let routeHasParams = req.path;
    for (const [key, value] of Object.entries(req.params)) {
      routeHasParams = routeHasParams.replace(value, `:${key}`);
    }
    return routeHasParams.replace(
      this.configService.get(EnvVars.SERVER_PREFIX),
      ''
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();
    if (this.apiService.isPathNotCheckPermission(req.path)) return true;
    const userRouterPermissions = await this.userService.getRouterPermissions(
      req.body[KEY_FROM_DECODED_TOKEN].user_id
    );
    const currentRouter = this.getRouteHasParams(req);
    if (!userRouterPermissions.includes(currentRouter)) return false;

    return true;
  }
}
