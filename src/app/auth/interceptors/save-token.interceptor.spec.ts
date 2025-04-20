import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';
import { SaveTokenInterceptor } from './save-token.interceptor';
import { StringUtilService } from 'src/common/utils/string/string-util.service';

describe('SaveTokenInterceptor', () => {
  let interceptor: SaveTokenInterceptor;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [SaveTokenInterceptor, StringUtilService],
    });

    interceptor = app.get<SaveTokenInterceptor>(SaveTokenInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
