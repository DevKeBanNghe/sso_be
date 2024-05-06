import { SignInDto } from './dto/sign.dto';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await AutoMockingTestingModule.createTestingModule({
      imports: [AuthModule],
    });
    service = moduleRef.get(AuthService);
  });
  describe('signIn', () => {
    it('should return auth', async () => {
      const signInDto: SignInDto = {
        user_name: 'trung@gmail.com',
        password: '123456',
      };

      const result = {
        user_name: 'trung',
      };

      const { access_token, refresh_token, ...user_data } =
        await service.signIn(signInDto);
      expect(user_data).toEqual(result);
    });
  });
});
