import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StringService } from 'src/common/utils/string/string.service';
import { JwtService } from '@nestjs/jwt';
import { TokenExpireIn } from 'src/consts/jwt.const';
import { SignInDto, SignInSocialDto, SignUpDto } from './dto/sign.dto';
import { AuthToken } from './types/token.type';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
import { GoogleUserDto } from './dto/google-oauth2.dto';
import { TypeLogin } from '../user/entities/user.entity';
import { WebRedirectDto } from './dto/web.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private stringService: StringService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async verifyToken(
    token: string,
    secret_key: string = this.configService.get(EnvVars.JWT_SECRET_KEY)
  ) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: secret_key,
      });
      return { decoded, error: null };
    } catch (error) {
      return { decoded: null, error };
    }
  }

  async createToken(payload): Promise<AuthToken> {
    const access_token = await this.jwtService.signAsync(payload);

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: TokenExpireIn.REFRESH_TOKEN_EXPIRE_IN,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.getFirstBy([
      { user_email: signUpDto.email },
      { user_name: signUpDto.user_name },
      { user_phone_number: signUpDto.phone_number },
    ]);

    if (user) throw new BadRequestException('Information has been registered!');

    signUpDto.password = signUpDto.password ?? this.stringService.genRandom();

    const userCreated = await this.userService.create({
      user_email: signUpDto.email,
      user_password: await this.stringService.hash(signUpDto.password),
      user_name: signUpDto.user_name,
      user_first_name: signUpDto.user_first_name,
      user_last_name: signUpDto.user_last_name,
      user_phone_number: signUpDto.phone_number,
      user_date_of_birth: signUpDto.date_of_birth,
      user_image_url: signUpDto.user_image_url,
      user_type_login: signUpDto.user_type_login,
    });

    if (!userCreated) throw new BadRequestException('Sign up failed');

    return await this.signIn({
      user_name: userCreated.user_name,
      password: signUpDto.password,
    });
  }

  async signInWithGoogle(signInSocialDto: SignInSocialDto) {
    // check user exists
    const user = await this.userService.getFirstBy({
      user_email: signInSocialDto.user_email,
      user_type_login: TypeLogin.GOOGLE,
    });
    if (!user)
      throw new UnauthorizedException('Not found user login with google');

    return {
      ...(await this.createToken({
        user_id: user.user_id,
        user_name: user.user_name,
      })),
      user_name: user.user_name,
      user_email: user.user_email,
    };
  }
  async signIn(signInDto: SignInDto) {
    const user_name = signInDto.user_name;
    // check user exists
    const user = await this.userService.getFirstBy([
      { user_name },
      { user_email: user_name },
      { user_phone_number: user_name },
    ]);
    if (!user) throw new UnauthorizedException();
    const is_correct_pwd = await this.stringService.compareHash(
      signInDto.password,
      user.user_password
    );
    if (!is_correct_pwd) throw new UnauthorizedException();

    return {
      ...(await this.createToken({
        user_id: user.user_id,
        user_name: user.user_name,
      })),
      user_name: user.user_name,
      user_email: user.user_email,
    };
  }

  async signUpWithGoogleOAuth2(user: GoogleUserDto) {
    if (!user) throw new UnauthorizedException('Not found user from google!');

    const userFind = await this.userService.getFirstBy({
      user_email: user.email,
      user_type_login: TypeLogin.GOOGLE,
    });

    if (userFind)
      return await this.signInWithGoogle({
        user_name: userFind.user_name,
      });

    return await this.signUp({
      email: user.email,
      user_first_name: user.first_name,
      user_last_name: user.last_name,
      user_name: `${user.first_name} ${user.last_name}`,
      password: null,
      user_image_url: user.picture,
      user_type_login: TypeLogin.GOOGLE,
    });
  }
}
