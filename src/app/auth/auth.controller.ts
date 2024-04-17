import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  UnauthorizedException,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/sign.dto';
import { StringService } from 'src/common/utils/string/string.service';
import { ApiService } from 'src/common/utils/api/api.service';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { GoogleOAuth2Guard } from './guards/google-oauth2.guard';
import { Request, Response } from 'express';
import { GoogleUserDto } from './dto/google-oauth2.dto';
import {
  COOKIE_REDIRECT_EXPIRE_IN,
  COOKIE_REDIRECT_KEY,
} from 'src/consts/cookie.const';
import { RedirectToInterceptor } from './interceptors/redirect-to.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly stringService: StringService,
    private readonly apiService: ApiService
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SaveTokenInterceptor)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @UseInterceptors(SaveTokenInterceptor)
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Get('google')
  @Redirect('google-redirect')
  googleOAuth2Handle(@Res() res: Response, @Query() query: any) {
    res.cookie(COOKIE_REDIRECT_KEY, query, {
      httpOnly: true,
      maxAge: this.stringService.toMS(COOKIE_REDIRECT_EXPIRE_IN),
    });
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuth2Guard)
  @UseInterceptors(RedirectToInterceptor)
  async signUpWithGoogleOAuth2(@Req() req: Request) {
    const cookie_data = req.cookies[COOKIE_REDIRECT_KEY];
    if (!cookie_data.from_url)
      throw new UnauthorizedException('Sign up with google failed!');

    const data = await this.authService.signUpWithGoogleOAuth2(
      req.user as GoogleUserDto
    );
    if (!data) throw new UnauthorizedException('Sign up with google failed!');

    return data;
  }
}
