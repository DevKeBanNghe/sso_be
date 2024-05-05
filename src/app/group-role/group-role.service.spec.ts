import { GroupRoleService } from './group-role.service';
import { GroupRoleModule } from './group-role.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('GroupRoleService', () => {
  let service: GroupRoleService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [GroupRoleModule],
    });

    service = module.get<GroupRoleService>(GroupRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
