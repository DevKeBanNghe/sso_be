import { Test, TestingModule } from '@nestjs/testing';
import { AutoMockingTestingService } from './auto-mocking-testing.service';

describe('AutoMockingTestingService', () => {
  let service: AutoMockingTestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoMockingTestingService],
    }).compile();

    service = module.get<AutoMockingTestingService>(AutoMockingTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
