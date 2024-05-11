import { Controller, Get, Redirect } from '@nestjs/common';
import { EnvVars } from 'src/consts';

@Controller()
export class AppController {
  @Get()
  @Redirect(process.env[EnvVars.FE_URL])
  redirectToSSOFe() {
    return { redirect_to: process.env[EnvVars.FE_URL] };
  }
}
