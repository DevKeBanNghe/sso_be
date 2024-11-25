import { AllExceptionFilter } from './all-exception.filter';
import { AutoMockingTestingModule } from '../testing/auto-mocking/auto-mocking-testing.module';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [AllExceptionFilter],
    });

    filter = app.get(AllExceptionFilter);
  });
  it('should be defined', () => {
    expect(filter).toBeDefined();
  });
});
