import { IsInt, IsNumber, IsString } from 'class-validator';

export class Role {
  @IsNumber()
  role_id: number;
  @IsString()
  role_name: string;
  @IsString()
  role_description: string;
  @IsInt()
  role_parent_id: number;
}
