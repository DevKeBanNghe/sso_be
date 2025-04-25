import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Req,
  UseGuards,
  Get,
  UnauthorizedException,
  Query,
  Redirect,
  Res,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  FacebookUserDto,
  GithubUserDto,
  GoogleUserDto,
  handleSignUpSocialsParams,
  SignInDto,
  SignUpDto,
} from './dto/sign.dto';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { GoogleOAuth2Guard } from './guards/google-oauth2.guard';
import { Request, Response } from 'express';
import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REDIRECT_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';
import { RedirectToInterceptor } from './interceptors/redirect-to.interceptor';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { GithubGuard } from './guards/github.guard';
import { ApiService } from 'src/common/utils/api/api.service';
import { FacebookGuard } from './guards/facebook.guard';
import { TypeLogin } from '@prisma-postgresql/enums';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpHeaders } from 'src/consts/enum.const';
import { isString } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post('sign-in')
  @UseInterceptors(SaveTokenInterceptor)
  async signIn(@Body() { webpage_key, ...dataSingIn }: SignInDto) {
    const data = await this.authService.signIn(dataSingIn);
    if (!webpage_key) return data;
    const webpage = await this.authService.getWebpageRedirect(webpage_key);
    const dataRes = {
      ...data,
      ...webpage,
    };
    await this.cacheManager.set(
      `${data.user_id}_${webpage_key}`,
      JSON.stringify(dataRes),
      60000
    );
    return dataRes;
  }

  @Post('sign-up')
  @UseInterceptors(SaveTokenInterceptor)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('google')
  @Redirect('google-redirect')
  googleOAuth2Handle(
    @Res() res: Response,
    @Query('webpage_key') webpage_key: string
  ) {
    return this.authService.googleOAuth2Handle({ res, webpage_key });
  }

  private async handleSignUpSocials({
    type = TypeLogin.GOOGLE,
    data,
    webpage_key,
  }: handleSignUpSocialsParams) {
    if (!data)
      throw new UnauthorizedException(
        `Sign up with ${type.toLowerCase()} failed!`
      );

    if (!webpage_key) return data;

    const webpage = await this.authService.getWebpageRedirect(webpage_key);
    return { ...data, ...webpage };
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuth2Guard)
  @UseInterceptors(RedirectToInterceptor)
  async signUpWithGoogleOAuth2(@Req() req: Request) {
    const data = await this.authService.signUpWithGoogleOAuth2(
      req.user as GoogleUserDto
    );
    return this.handleSignUpSocials({
      data,
      webpage_key: req.cookies[COOKIE_REDIRECT_KEY],
    });
  }

  @Get('github')
  @Redirect('github-redirect')
  githubHandle(
    @Res() res: Response,
    @Query('webpage_key') webpage_key: string
  ) {
    return this.authService.githubHandle({ res, webpage_key });
  }

  @Get('github-redirect')
  @UseGuards(GithubGuard)
  @UseInterceptors(RedirectToInterceptor)
  async signUpWithGithub(@Req() req: Request) {
    const data = await this.authService.signUpWithGithub(
      req.user as GithubUserDto
    );

    return this.handleSignUpSocials({
      type: TypeLogin.GITHUB,
      data,
      webpage_key: req.cookies[COOKIE_REDIRECT_KEY],
    });
  }

  @Get('facebook')
  @Redirect('facebook-redirect')
  facebookHandle(
    @Res() res: Response,
    @Query('webpage_key') webpage_key: string
  ) {
    return this.authService.facebookHandle({ res, webpage_key });
  }

  @Get('facebook-redirect')
  @UseGuards(FacebookGuard)
  @UseInterceptors(RedirectToInterceptor)
  async signUpWithFacebook(@Req() req: Request) {
    const data = await this.authService.signUpWithFacebook(
      req.user as FacebookUserDto
    );

    return this.handleSignUpSocials({
      type: TypeLogin.FACEBOOK,
      data,
      webpage_key: req.cookies[COOKIE_REDIRECT_KEY],
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie(COOKIE_ACCESS_TOKEN_KEY);
    res.clearCookie(COOKIE_REFRESH_TOKEN_KEY);
    res.status(200).json({});
    return {};
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('refresh-token')
  @UseInterceptors(SaveTokenInterceptor)
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
    @Query('user_id') user_id
  ) {
    const webpage_key = this.apiService.getHeadersParam({
      key: HttpHeaders.WEBPAGE_KEY,
      headers: req.headers,
    });
    const isRefreshTokenRedirect = user_id && webpage_key;
    if (isRefreshTokenRedirect) {
      const key = `${user_id}_${webpage_key}`;
      const data = await this.cacheManager.get(key);
      if (isString(data)) {
        await this.cacheManager.del(key);
        return JSON.parse(data);
      }
    }

    const token =
      req.cookies[COOKIE_REFRESH_TOKEN_KEY] ??
      this.apiService.getBearerToken({ headers: req.headers });
    if (!token) throw new UnauthorizedException('Token is required!');
    const newTokens = await this.authService.refreshToken({
      token,
      response: res,
    });
    return newTokens;
  }

  @Get('cookie-keys')
  async getCookieKeys() {
    return this.authService.getCookieKeys();
  }
}
