import { IsEmail, IsString, Matches } from 'class-validator';

export class Auth {
  @IsString()
  user_name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @Matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
  phone_number: string;
  @IsString()
  date_of_birth: string;
}
