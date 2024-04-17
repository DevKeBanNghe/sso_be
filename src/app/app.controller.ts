import { Controller, Get, Redirect } from '@nestjs/common';
import { EnvVars } from 'src/consts';

@Controller()
export class AppController {
  @Get()
  @Redirect(process.env[EnvVars.URL_FE_SSO])
  redirectToSSOFe() {
    return { redirect_to: process.env[EnvVars.URL_FE_SSO] };
  }
}
