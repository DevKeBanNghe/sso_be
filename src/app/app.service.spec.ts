import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [AppService],
    });

    service = app.get<AppService>(AppService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
