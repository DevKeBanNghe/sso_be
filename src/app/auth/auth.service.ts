import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StringUtilService } from 'src/common/utils/string/string-util.service';
import { TokenExpireIn } from 'src/consts/jwt.const';
import {
  FacebookUserDto,
  GithubUserDto,
  GoogleUserDto,
  SignInDto,
  SignUpDto,
  SocialsSignDto,
} from './dto/sign.dto';
import {
  AuthToken,
  RefreshTokenParams,
  TokenData,
} from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts/env.const';
import { MailerService } from '@nestjs-modules/mailer';
import { MailTemplate } from 'src/consts/mail.const';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { WebpageService } from '../webpage/webpage.service';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REDIRECT_EXPIRE_IN,
  COOKIE_REDIRECT_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';
import ms from 'ms';
import { TypeLogin } from '@prisma-postgresql/enums';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private stringUtilService: StringUtilService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly webpageService: WebpageService
  ) {}

  private readonly VERIFY_PASSWORD_EXPIRE_IN = '5m';

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
    const { user_name, user_email, user_phone_number, user_password } =
      signUpDto;
    const user = await this.userService.instance.findFirst({
      select: {
        user_id: true,
      },
      where: {
        OR: [{ user_email }, { user_name }, { user_phone_number }],
      },
    });
    if (user) throw new BadRequestException('Information has been registered!');

    const passwordHashed = await this.stringUtilService.hashSync(
      user_password ?? this.stringUtilService.genRandom()
    );
    const userCreated = await this.userService.create({
      ...signUpDto,
      user_password: passwordHashed,
      user_name: user_name ?? user_email,
    } as CreateUserDto);
    if (!userCreated) throw new BadRequestException('Sign up failed');
    const data = await this.signIn({
      user_name: userCreated.user_name,
      user_password,
    });
    return data;
  }

  async signIn(signInDto: SignInDto) {
    const { user_name, user_password, user_type_login } = signInDto;
    const conditionFindUser = {
      OR: [
        { user_name },
        { user_email: user_name },
        { user_phone_number: user_name },
      ],
      user_type_login: user_password ? TypeLogin.ACCOUNT : user_type_login,
    };
    const defaultPermissionSelect = {
      permissions: {
        select: {
          permission: {
            select: {
              permission_key: true,
            },
          },
        },
      },
    };
    const user = await this.userService.instance.findFirst({
      where: conditionFindUser,
      select: {
        user_id: true,
        user_name: true,
        user_password: true,
        is_supper_admin: true,
        roles: {
          select: {
            role: {
              select: {
                ...defaultPermissionSelect,
                children: {
                  select: {
                    ...defaultPermissionSelect,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException();

    if (user_password) {
      const is_correct_pwd = await this.stringUtilService.compareHashSync(
        user_password,
        user.user_password
      );
      if (!is_correct_pwd) throw new UnauthorizedException();
    }

    const { user_password: userPassword, roles, ...userData } = user;
    const permissions = roles.reduce((acc, { role }) => {
      const permissionKey = role.permissions.map(
        ({ permission }) => permission.permission_key
      );
      const permissionKeyChildren = role.children.reduce(
        (acc, { permissions }) =>
          acc.concat(
            permissions.map(({ permission }) => permission.permission_key)
          ),
        []
      );
      acc.push(...permissionKey, ...permissionKeyChildren);
      return acc;
    }, []);

    const data: TokenData = {
      ...userData,
      permissions,
    };
    const token = await this.createToken(data);
    return { ...token, ...data };
  }

  async signUpWithGoogleOAuth2(user: GoogleUserDto) {
    if (!user)
      throw new UnauthorizedException(
        `Not found user from ${TypeLogin.GOOGLE.toLowerCase()}!`
      );

    const userFind = await this.userService.instance.findFirst({
      where: {
        user_email: user.email,
        user_type_login: TypeLogin.GOOGLE,
      },
    });

    if (userFind)
      return await this.signIn({
        user_name: userFind.user_name,
        user_type_login: TypeLogin.GOOGLE,
      });

    return await this.signUp({
      user_email: user.email,
      user_first_name: user.first_name,
      user_last_name: user.last_name,
      user_name: `${user.first_name} ${user.last_name}`,
      user_password: null,
      user_image_url: user.picture,
      user_type_login: TypeLogin.GOOGLE,
      created_by: user.email,
    });
  }

  async signUpWithGithub(user: GithubUserDto) {
    if (!user)
      throw new UnauthorizedException(
        `Not found user from ${TypeLogin.GITHUB.toLowerCase()}!`
      );
    const userFind = await this.userService.instance.findFirst({
      where: {
        user_email: user.email ?? user.user_name,
        user_type_login: TypeLogin.GITHUB,
      },
    });

    if (userFind)
      return await this.signIn({
        user_name: userFind.user_name,
        user_type_login: TypeLogin.GITHUB,
      });

    return await this.signUp({
      user_email: user.email,
      user_first_name: user.first_name,
      user_last_name: user.last_name,
      user_name: user.user_name ?? `${user.first_name} ${user.last_name}`,
      user_password: null,
      user_image_url: user.avatar_url,
      user_type_login: TypeLogin.GITHUB,
      created_by: user.email,
    });
  }

  async signUpWithFacebook(user: FacebookUserDto) {
    if (!user)
      throw new UnauthorizedException(
        `Not found user from ${TypeLogin.FACEBOOK.toLowerCase()}!`
      );
    const userFind = await this.userService.instance.findFirst({
      where: {
        user_email: user.email ?? user.user_name,
        user_type_login: TypeLogin.FACEBOOK,
      },
    });

    if (userFind)
      return await this.signIn({
        user_name: userFind.user_name,
        user_type_login: TypeLogin.FACEBOOK,
      });

    return await this.signUp({
      user_email: user.email,
      user_first_name: user.first_name,
      user_last_name: user.last_name,
      user_name: user.user_name ?? `${user.first_name} ${user.last_name}`,
      user_password: null,
      user_type_login: TypeLogin.FACEBOOK,
      created_by: user.email,
    });
  }

  sendSMS() {
    return {};
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.instance.findFirst({
      where: {
        OR: [
          { user_email: forgotPasswordDto.user_email },
          { user_phone_number: forgotPasswordDto.user_phone_number },
        ],
      },
    });

    if (!user) throw new UnauthorizedException('Not found user');

    if (forgotPasswordDto.user_email) {
      this.mailerService.sendMail({
        to: user.user_email,
        subject: 'Reset password',
        template: MailTemplate.RESET_PASSWORD,
        context: {
          redirect_to: forgotPasswordDto.redirect_to,
        },
      });
    } else {
      this.sendSMS();
    }

    const code_reset = this.stringUtilService.encrypt(
      {
        user_id: user.user_id,
      },
      this.VERIFY_PASSWORD_EXPIRE_IN
    );
    return { code_reset };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const decoded = this.stringUtilService.decrypt(resetPasswordDto.code_reset);

    if (!decoded) throw new BadRequestException('Reset password failed');

    return await this.userService.update({
      user_id: decoded.user_id,
      user_password: await this.stringUtilService.hashSync(
        resetPasswordDto.user_password
      ),
    });
  }

  async getWebpageRedirect(webpage_key: string) {
    const data = await this.webpageService.extended.findFirst({
      select: {
        webpage_url: true,
      },
      where: {
        webpage_key,
      },
    });
    return data ?? {};
  }

  async refreshToken({ token, response }: RefreshTokenParams) {
    const { decoded, error } = await this.verifyToken(token);
    if (error) {
      if (error instanceof TokenExpiredError) {
        response.clearCookie(COOKIE_ACCESS_TOKEN_KEY);
        response.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
      }
      throw new UnauthorizedException(error);
    }
    const { exp, ...payload } = decoded;
    const newTokens = await this.createToken(payload);
    return newTokens;
  }

  private saveWebpageKeyToCookie({ webpage_key, res }: SocialsSignDto) {
    res.cookie(COOKIE_REDIRECT_KEY, webpage_key, {
      httpOnly: true,
      maxAge: ms(COOKIE_REDIRECT_EXPIRE_IN),
    });
  }
  googleOAuth2Handle({ webpage_key, res }: SocialsSignDto) {
    return this.saveWebpageKeyToCookie({ webpage_key, res });
  }

  githubHandle({ webpage_key, res }: SocialsSignDto) {
    return this.saveWebpageKeyToCookie({ webpage_key, res });
  }

  facebookHandle({ webpage_key, res }: SocialsSignDto) {
    return this.saveWebpageKeyToCookie({ webpage_key, res });
  }
}
