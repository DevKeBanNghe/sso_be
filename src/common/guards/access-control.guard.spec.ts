import { Test } from '@nestjs/testing';
import { AccessControlGuard } from './access-control.guard';
import { ConfigService } from '@nestjs/config';
import { ApiService } from '../utils/api/api.service';
import { UserService } from 'src/app/user/user.service';
import { AutoMockingTestingModule } from '../testing/auto-mocking/auto-mocking-testing.module';

describe('AccessControlGuard', () => {
  let guard: AccessControlGuard;

  beforeAll(async () => {
    const app = await AutoMockingTestingModule.createTestingModule({
      providers: [AccessControlGuard],
    });

    guard = app.get<AccessControlGuard>(AccessControlGuard);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
