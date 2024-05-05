import { IsNumber, IsString } from 'class-validator';

export class Permission {
  @IsNumber()
  permission_id: number;
  @IsString()
  permission_name: string;
  @IsString()
  permission_description: string;
  @IsString()
  permission_key: string;
  @IsNumber()
  group_permission_id: number;
}
