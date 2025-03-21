import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiService, ConfigService],
    }).compile();

    service = await module.resolve<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
