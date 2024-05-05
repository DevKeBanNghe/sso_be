import { Test } from '@nestjs/testing';
import { AccessControlGuard } from './access-control.guard';
import { ConfigService } from '@nestjs/config';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AccessControlGuard, ConfigService],
    }).compile();

    guard = app.get<AccessControlGuard>(AccessControlGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
