import { LoggingInterceptor } from './logging.interceptor';
import { AutoMockingTestingModule } from '../testing/auto-mocking/auto-mocking-testing.module';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [LoggingInterceptor],
    });

    interceptor = await app.resolve(LoggingInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
