import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RoleService } from 'src/app/role/role.service';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';

@Injectable()
export class AccessControlGuard {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request & { user: { roles } }>();
    const res = getResponse<Response>();
    // const { granted } = await this.roleService.validateRoles({
    //   method: req.method as HttpMethods,
    //   resource: req.path.replace(
    //     this.configService.get(EnvVars.SERVER_PREFIX),
    //     ''
    //   ),
    //   roles: req.user.roles,
    // });
    // if (!granted) throw new ForbiddenException();
    return Promise.resolve(true);
  }
}
