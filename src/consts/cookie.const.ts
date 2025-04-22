import ms from 'ms';
import { TokenExpireIn } from './jwt.const';
import { CookieOptions } from 'express';

export const COOKIE_ACCESS_TOKEN_KEY = `${process.env.APP_NAME}_AT`,
  COOKIE_REFRESH_TOKEN_KEY = `${process.env.APP_NAME}_RT`;

export const COOKIE_REDIRECT_KEY = `${process.env.APP_NAME}_data_redirect`,
  COOKIE_REDIRECT_EXPIRE_IN = `10m`;

export const cookieConfigsDefault: CookieOptions = {
  httpOnly: true,
  maxAge: ms(TokenExpireIn.ACCESS_TOKEN_EXPIRE_IN),
  sameSite: 'none',
  secure: true,
};
