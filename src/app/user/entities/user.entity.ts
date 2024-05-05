import { DefaultValuePipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { Device } from 'src/app/device/entities/device.entity';

export enum TypeLogin {
  ACCOUNT = 'ACCOUNT',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export class User {
  @IsNumber()
  readonly user_id: number;
  @IsString()
  user_first_name: string;
  @IsString()
  user_last_name: string;
  @IsString()
  user_name: string;
  @IsString()
  user_password: string;
  @IsEmail()
  user_email: string;

  @IsString()
  user_phone_number: string;
  @IsString()
  user_date_of_birth: string;
  @IsString()
  user_image_url: string;

  @IsNumber()
  role_id: number;

  @IsArray()
  @Type(() => Device)
  user_devices: Device[];

  @IsEnum(TypeLogin)
  user_type_login: TypeLogin;
  created_at: Date;
  updated_at: Date;
}
