import { PermissionService } from './permission.service';
import { PermissionModule } from './permission.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [PermissionModule],
    });

    service = await module.resolve<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
