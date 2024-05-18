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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GithubUserDto,
  GoogleUserDto,
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService
  ) {}

  @Post('sign-in')
  @UseInterceptors(SaveTokenInterceptor)
  async signIn(@Body() { webpage_key, ...dataSingIn }: SignInDto) {
    const data = await this.authService.signIn(dataSingIn);

    if (!webpage_key) return data;
    const webpage = await this.authService.getWebpageRedirect(webpage_key);
    return {
      ...data,
      ...webpage,
    };
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

  @Get('google-redirect')
  @UseGuards(GoogleOAuth2Guard)
  @UseInterceptors(RedirectToInterceptor)
  async signUpWithGoogleOAuth2(@Req() req: Request) {
    const data = await this.authService.signUpWithGoogleOAuth2(
      req.user as GoogleUserDto
    );
    if (!data) throw new UnauthorizedException('Sign up with google failed!');

    const webpage_key = req.cookies[COOKIE_REDIRECT_KEY];
    if (!webpage_key) return data;

    const webpage = await this.authService.getWebpageRedirect(webpage_key);
    if (!webpage) return data;

    return { ...data, ...webpage };
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
    if (!data) throw new UnauthorizedException('Sign up with github failed!');

    const webpage_key = req.cookies[COOKIE_REDIRECT_KEY];
    if (!webpage_key) return data;

    const webpage = await this.authService.getWebpageRedirect(webpage_key);

    if (!webpage) return data;
    return { ...data, ...webpage };
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
  async refreshToken(@Req() req: Request) {
    const token =
      req.cookies[COOKIE_REFRESH_TOKEN_KEY] ??
      this.apiService.getBearerToken(req.headers);
    if (!token) throw new UnauthorizedException('Token is required');
    return this.authService.refreshToken(token);
  }
}
