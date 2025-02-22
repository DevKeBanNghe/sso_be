import { Permission, User } from '@prisma/postgresql_client';
import { Response } from 'express';
interface AuthToken {
  access_token: string;
  refresh_token: string;
}

interface TokenData {
  permissions: Permission['permission_key'][];
  user_id: User['user_id'];
  user_name: User['user_name'];
}

interface RefreshTokenParams {
  token: AuthToken['refresh_token'];
  response: Response;
}

export { AuthToken, TokenData, RefreshTokenParams };
