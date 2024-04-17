import { StringService } from 'src/common/utils/string/string.service';
import { RedirectToInterceptor } from './redirect-to.interceptor';

describe('RedirectToInterceptor', () => {
  it('should be defined', () => {
    expect(new RedirectToInterceptor(new StringService())).toBeDefined();
  });
});
