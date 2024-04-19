import { Test } from '@nestjs/testing';
import { SaveTokenInterceptor } from './save-token.interceptor';
import { StringUtilService } from 'src/common/utils/string/string-util.service';

describe('SaveTokenInterceptor', () => {
  let interceptor: SaveTokenInterceptor;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [SaveTokenInterceptor, StringUtilService],
    }).compile();

    interceptor = app.get<SaveTokenInterceptor>(SaveTokenInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
