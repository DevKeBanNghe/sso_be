import { IsNumber, IsString } from 'class-validator';

export class GroupRole {
  @IsNumber()
  group_role_id: number;
  @IsString()
  group_role_name: string;
  @IsString()
  group_role_description: string;
  @IsNumber()
  group_role_parent_id: number;
  @IsNumber()
  webpage_id: number;
}
