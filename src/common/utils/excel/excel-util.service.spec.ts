import { Test, TestingModule } from '@nestjs/testing';
import { ExcelUtilService } from './excel-util.service';
import { ExcelUtilModule } from './excel-util.module';

describe('ExcelUtilService', () => {
  let service: ExcelUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExcelUtilModule],
    }).compile();

    service = module.get<ExcelUtilService>(ExcelUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
