import { IsNumber, IsString } from 'class-validator';

export class GroupPermission {
  @IsNumber()
  group_permission_id: number;
  @IsString()
  group_permission_name: string;
  @IsString()
  group_permission_description: string;
  @IsNumber()
  group_permission_parent_id: number;
  @IsString()
  group_permission_route_resources: string;
}
