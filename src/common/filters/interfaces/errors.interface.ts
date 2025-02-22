import { TokenExpiredError } from '@nestjs/jwt';

interface ErrorsInfo extends Partial<TokenExpiredError> {
  message: string;
  status: number;
}

interface ErrorsResponse {
  path?: string;
  errors?: string[];
  code?: number;
}

export { ErrorsInfo, ErrorsResponse };
