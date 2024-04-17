import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleOAuth2Guard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
