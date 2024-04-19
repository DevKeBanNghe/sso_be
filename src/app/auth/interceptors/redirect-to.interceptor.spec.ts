import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { RedirectToInterceptor } from './redirect-to.interceptor';
import { Test } from '@nestjs/testing';

describe('RedirectToInterceptor', () => {
  let interceptor: RedirectToInterceptor;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [RedirectToInterceptor, StringUtilService],
    }).compile();

    interceptor = app.get(RedirectToInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
