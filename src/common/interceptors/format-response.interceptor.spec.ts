import { FormatResponseInterceptor } from './format-response.interceptor';
import { AutoMockingTestingModule } from '../testing/auto-mocking/auto-mocking-testing.module';

describe('FormatResponseInterceptor', () => {
  let interceptor: FormatResponseInterceptor;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [FormatResponseInterceptor],
    });

    interceptor = app.get(FormatResponseInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
