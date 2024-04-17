import { Test } from '@nestjs/testing';
import { SignInDto } from './dto/sign.dto';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { GoogleStrategy } from './strategies/google-oauth2.strategy';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = moduleRef.get(AuthService);
  });
  describe('signIn', () => {
    it('should return auth', async () => {
      const signInDto: SignInDto = {
        user_name: 'trung1',
        password: '123456',
      };

      const result = {
        user_name: 'trung1',
        user_email: 'trung1@gmail.com',
      };

      const { access_token, refresh_token, ...user_data } =
        await service.signIn(signInDto);
      expect(user_data).toEqual(result);
    });
  });
});
