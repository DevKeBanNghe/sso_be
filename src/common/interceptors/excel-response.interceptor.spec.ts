import { ExcelResponseInterceptor } from './excel-response.interceptor';
import { AutoMockingTestingModule } from '../testing/auto-mocking/auto-mocking-testing.module';

describe('ExcelResponseInterceptor', () => {
  let interceptor: ExcelResponseInterceptor;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [ExcelResponseInterceptor],
    });

    interceptor = await app.resolve(ExcelResponseInterceptor);
  });
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
});
