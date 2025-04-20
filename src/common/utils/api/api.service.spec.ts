import { TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [ApiService, ConfigService],
      });

    service = await module.resolve<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
