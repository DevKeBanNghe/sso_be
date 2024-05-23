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

  private req: Request;

  getRouteHasParams() {
    let routeHasParams = this.req.path;
    for (const [key, value] of Object.entries(this.req.params)) {
      routeHasParams = routeHasParams.replace(value, `:${key}`);
    }
    return routeHasParams.replace(
      this.configService.get(EnvVars.SERVER_PREFIX),
      ''
    );
  }

  private async isValidRouteAccess(user_id: number) {
    const isAdmin = await this.userService.isAdmin(user_id);
    if (isAdmin) return true;

    const userRouterPermissions = await this.userService.getRoutersPermission(
      user_id
    );
    const currentRouter = this.getRouteHasParams();
    return userRouterPermissions.includes(currentRouter);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();
    this.req = req;
    if (this.apiService.isPathNotCheckPermission(req.path)) return true;
    const user_id = req.body[KEY_FROM_DECODED_TOKEN].user_id;

    const isValid = await this.isValidRouteAccess(user_id);
    if (isValid) return true;

    return false;
  }
}
