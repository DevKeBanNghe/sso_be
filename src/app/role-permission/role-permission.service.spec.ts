import { RolePermissionService } from './role-permission.service';
import { RolePermissionModule } from './role-permission.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('RolePermissionService', () => {
  let service: RolePermissionService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [RolePermissionModule],
    });

    service = module.get<RolePermissionService>(RolePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
