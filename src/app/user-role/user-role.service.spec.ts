import { UserRoleService } from './user-role.service';
import { UserRoleModule } from './user-role.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('UserRoleService', () => {
  let service: UserRoleService;

  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [UserRoleModule],
    });

    service = module.get<UserRoleService>(UserRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
