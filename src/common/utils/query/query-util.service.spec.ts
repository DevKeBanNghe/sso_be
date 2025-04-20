import { TestingModule } from '@nestjs/testing';
import { QueryUtilService } from './query-util.service';
import { JwtService } from '@nestjs/jwt';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('QueryUtilService', () => {
  let service: QueryUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [QueryUtilService, JwtService],
      });

    service = module.get<QueryUtilService>(QueryUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
