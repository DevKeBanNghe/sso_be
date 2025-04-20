import { TestingModule } from '@nestjs/testing';
import { AutoMockingTestingService } from './auto-mocking-testing.service';
import { AutoMockingTestingModule } from './auto-mocking-testing.module';

describe('AutoMockingTestingService', () => {
  let service: AutoMockingTestingService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [AutoMockingTestingService],
      });

    service = module.get<AutoMockingTestingService>(AutoMockingTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
