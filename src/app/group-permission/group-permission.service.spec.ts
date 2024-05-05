import { GroupPermissionService } from './group-permission.service';
import { GroupPermissionModule } from './group-permission.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('GroupPermissionService', () => {
  let service: GroupPermissionService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [GroupPermissionModule],
    });

    service = module.get<GroupPermissionService>(GroupPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
