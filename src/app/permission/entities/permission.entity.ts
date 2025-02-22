import { IsString } from 'class-validator';

export class Permission {
  @IsString()
  permission_id: string;
  @IsString()
  permission_name: string;
  @IsString()
  permission_description: string;
  @IsString()
  permission_key: string;
  @IsString()
  permission_router: string;
  @IsString()
  permission_parent_id: string;
  created_by: string;
}
