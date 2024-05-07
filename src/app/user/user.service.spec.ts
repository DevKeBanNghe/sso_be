import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';
import { UserModule } from './user.module';
import { UserService } from './user.service';
describe('UserService', () => {
  let service: UserService;
  beforeEach(async () => {
    const module = await AutoMockingTestingModule.createTestingModule({
      imports: [UserModule],
    });
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
