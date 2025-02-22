import { TokenData } from 'src/app/auth/interfaces/token.interface';

type BaseExtends<T> = {
  [K in keyof T]: T[K];
} & { user: TokenData };

type CreateExtends<T> = BaseExtends<T>;

type UpdateExtends<T> = BaseExtends<T>;

export { CreateExtends, UpdateExtends };
