import { TokenData } from 'src/app/auth/interfaces/token.interface';

abstract class BaseInstance {
  abstract get instance();
  abstract get extended();
}

class ImportExcel {
  file;
  user: TokenData;
}

export { BaseInstance, ImportExcel };
