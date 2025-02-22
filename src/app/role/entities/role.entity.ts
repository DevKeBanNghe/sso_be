import { IsString } from 'class-validator';

export class Role {
  @IsString()
  role_id: string;
  @IsString()
  role_name: string;
  @IsString()
  role_description: string;
  role_parent_id: string;
  created_by: string;
  is_active: number;
}
