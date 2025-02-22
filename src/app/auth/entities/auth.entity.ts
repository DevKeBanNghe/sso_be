import { IsEmail, IsString, Matches } from 'class-validator';

export class Auth {
  @IsString()
  user_name: string;
  @IsEmail()
  user_email: string;
  @IsString()
  user_password: string;
  @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
  user_phone_number: string;
  @IsString()
  user_date_of_birth: string;
}
