import { IsNumber, IsString } from 'class-validator';

export class Role {
  @IsNumber()
  role_id: number;
  @IsString()
  role_name: string;
  @IsString()
  role_description: string;
  @IsNumber()
  group_role_id: number;
}
