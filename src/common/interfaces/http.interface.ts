import { RequestMethod } from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { TokenData } from 'src/app/auth/interfaces/token.interface';
type HttpMethod = keyof typeof RequestMethod;

interface Request extends RequestExpress {
  user: TokenData;
}

export { HttpMethod, Request };
