import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/app/user/user.service';
import { EnvVars } from 'src/consts/env.const';
import { ApiService } from '../../utils/api/api.service';
import { WebpageService } from 'src/app/webpage/webpage.service';
import { HttpHeaders } from 'src/consts/enum.const';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { isEmpty } from 'lodash';
import { HttpMethod, Request } from '../../interfaces/http.interface';
import { CanAccessResourcesParams } from './dto/access-control.dto';

@Injectable()
export class AccessControlGuard implements CanActivate {
  private req: Request;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private apiService: ApiService,
    private webpageService: WebpageService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  getCurrentRoute() {
    const { path, params } = this.req;
    let basePath = path;
    for (const [key, value] of Object.entries(params)) {
      basePath = basePath.replace(value, `:${key}`);
    }
    return basePath.replace(this.configService.get(EnvVars.SERVER_PREFIX), '');
  }

  private async canAccessResources({ user_id }: CanAccessResourcesParams) {
    const isSupperAdmin = await this.userService.isSupperAdmin({ user_id });
    if (isSupperAdmin) return true;

    const webpage_key = this.apiService.getHeadersParam({
      key: HttpHeaders.WEBPAGE_KEY,
      headers: this.req.headers,
    });

    const isExistWebpage = await this.webpageService.isExistWebpage({
      webpage_key,
    });
    if (!isExistWebpage) return false;

    const currentRoute = this.getCurrentRoute();
    const requestMethod = this.req.method as HttpMethod;
    const webpagePermissions = await this.webpageService.getWebpagePermissions({
      webpage_key,
      permission_router: currentRoute,
      httpMethod: requestMethod,
    });
    if (isEmpty(webpagePermissions)) return false;

    const userPermissions = await this.userService.getUserPermissions({
      user_id,
      permission_router: currentRoute,
      httpMethod: requestMethod,
    });
    if (isEmpty(userPermissions)) return false;

    const webpagePermissionsAbility = webpagePermissions.map((item) => {
      const [__typename, actions] = Object.entries(item)[0];
      return { __typename, actions };
    });
    const webpageAbility = this.caslAbilityFactory.defineAbility(
      webpagePermissionsAbility
    );

    const canAccess = userPermissions.some((userPer) => {
      const routePermissionKey = `${currentRoute}_${requestMethod}`;
      return userPer[routePermissionKey].some((action) =>
        webpageAbility.can(action, routePermissionKey)
      );
    });

    return canAccess;
  }

  async canActivate(context: ExecutionContext) {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();
    this.req = req;
    const { user, originalUrl } = req;

    if (this.apiService.isPathNotAuth({ originalUrl })) return true;

    if (!user) return false;

    const canAccess = await this.canAccessResources({ user_id: user.user_id });
    return canAccess;
  }
}
