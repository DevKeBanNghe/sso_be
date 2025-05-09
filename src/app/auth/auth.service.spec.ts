import { SignInDto } from './dto/sign.dto';
import { AuthService } from './auth.service';
// import { AuthModule } from './auth.module';
import { AppModule } from '../app.module';
import { AutoMockingTestingModule } from 'src/common/testing/auto-mocking/auto-mocking-testing.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await AutoMockingTestingModule.createTestingModule({
      imports: [AppModule],
    });
    service = await moduleRef.resolve(AuthService);
  });
  describe('signIn', () => {
    it('should return auth', async () => {
      const signInDto: SignInDto = {
        user_name: 'trungcpt@gmail.com',
        user_password: 'Trungcpt@123',
      };

      const expectedUserData: SignInDto = {
        user_name: signInDto.user_name,
      };

      const {
        access_token,
        refresh_token,
        permissions,
        user_id,
        is_supper_admin,
        ...user_data
      } = await service.signIn(signInDto);
      expect(user_data).toEqual(expectedUserData);
    });
  });
});
