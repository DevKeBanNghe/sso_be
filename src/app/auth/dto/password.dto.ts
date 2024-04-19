import { PartialType, PickType } from '@nestjs/mapped-types';
import { Auth } from '../entities/auth.entity';

export class ForgotPasswordDto extends PartialType(
  PickType(Auth, ['email', 'phone_number'])
) {}

export class ResetPasswordDto extends PickType(Auth, ['password']) {
  code_reset: string;
}
