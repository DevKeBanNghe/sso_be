import { TestingModule } from '@nestjs/testing';
import { ExcelUtilService } from './excel-util.service';
import { ExcelUtilModule } from './excel-util.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('ExcelUtilService', () => {
  let service: ExcelUtilService;

  beforeEach(async () => {
    const module: TestingModule =
      await AutoMockingTestingModule.createTestingModule({
        imports: [ExcelUtilModule],
      });

    service = module.get<ExcelUtilService>(ExcelUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
