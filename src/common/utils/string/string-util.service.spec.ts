import { TestingModule } from '@nestjs/testing';
import { StringUtilService } from './string-util.service';
import { JwtService } from '@nestjs/jwt';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('StringUtilService', () => {
  let service: StringUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        providers: [StringUtilService, JwtService],
      });

    service = module.get<StringUtilService>(StringUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
