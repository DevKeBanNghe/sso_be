import { TestingModule } from '@nestjs/testing';
import { DateUtilService } from './date-util.service';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('DateUtilService', () => {
  let service: DateUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [DateUtilService],
      });

    service = module.get<DateUtilService>(DateUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
