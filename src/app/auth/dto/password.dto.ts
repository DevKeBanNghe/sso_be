import { PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';
import { IsString } from 'class-validator';

export class ForgotPasswordDto extends PartialType(
  PickType(Auth, ['email', 'phone_number'])
) {
  @IsString()
  redirect_to: string;
}

export class ResetPasswordDto extends PickType(Auth, ['password']) {
  @IsString()
  code_reset: string;
}
