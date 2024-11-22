import { AccessControlGuard } from './access-control.guard';
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
