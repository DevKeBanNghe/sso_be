import { IsString } from 'class-validator';

export class Webpage {
  @IsString()
  webpage_id: string;
  @IsString()
  webpage_name: string;
  @IsString()
  webpage_url: string;
  @IsString()
  webpage_key: string;
  @IsString()
  webpage_description: string;
  created_by: string;
}
