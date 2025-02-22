import { Test, TestingModule } from '@nestjs/testing';
import { QueryUtilService } from './query-util.service';
import { JwtService } from '@nestjs/jwt';

describe('QueryUtilService', () => {
  let service: QueryUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueryUtilService, JwtService],
    }).compile();

    service = module.get<QueryUtilService>(QueryUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
