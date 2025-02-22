import { ErrorsResponse } from 'src/common/filters/interfaces/errors.interface';

interface ApiResponse {
  timestamp?: string;
  data?: any;
}

interface FormatResponseParams extends ApiResponse, ErrorsResponse {}

export { FormatResponseParams };
