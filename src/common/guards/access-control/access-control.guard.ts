import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/app/user/user.service';
import { EnvVars } from 'src/consts/env.const';
import { ApiService } from '../../utils/api/api.service';
import { WebpageService } from 'src/app/webpage/webpage.service';
import { HttpHeaders } from 'src/consts/enum.const';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { isEmpty } from 'lodash';
import { HttpMethod } from '../../interfaces/http.interface';
import {
  CanAccessResourcesParams,
  GetCurrentRouteParams,
} from './dto/access-control.dto';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private apiService: ApiService,
    private webpageService: WebpageService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  getCurrentRoute({ requestPath, requestParams }: GetCurrentRouteParams) {
    let basePath = requestPath;
    for (const [key, value] of Object.entries(requestParams)) {
      basePath = basePath.replace(value, `:${key}`);
    }
    return basePath.replace(this.configService.get(EnvVars.SERVER_PREFIX), '');
  }

  private async canAccessResources({
    user_id,
    webpage_key,
    currentRoute,
    requestMethod,
  }: CanAccessResourcesParams) {
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

  async isWebpageValid({ webpage_key }) {
    const data = await this.webpageService.isExistWebpage({ webpage_key });
    return data;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { getRequest } = context.switchToHttp();
    const { path, params, method, body, headers } = getRequest<Request>();
    return true;
    if (this.apiService.isPathNotAuth(path)) return true;

    const webpage_key = headers[HttpHeaders.WEBPAGE_KEY] as string;
    if (isEmpty(webpage_key)) return false;

    const isWebpageValid = await this.isWebpageValid({ webpage_key });
    if (!isWebpageValid) return false;

    const user = body.user;
    if (!user) return false;

    const currentRoute = this.getCurrentRoute({
      requestPath: path,
      requestParams: params,
    });
    const canAccess = await this.canAccessResources({
      user_id: user.user_id,
      webpage_key,
      currentRoute,
      requestMethod: method as HttpMethod,
    });
    return canAccess;
  }
}
