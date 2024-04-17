import { ConfigService } from '@nestjs/config';
import { ApiService } from '../utils/api/api.service';
import { AuthGuard } from './auth.guard';
import { Test } from '@nestjs/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuthGuard, ApiService, ConfigService],
    }).compile();

    guard = app.get<AuthGuard>(AuthGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
