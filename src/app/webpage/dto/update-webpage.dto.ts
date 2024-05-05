import { PartialType } from '@nestjs/swagger';
import { CreateWebpageDto } from './create-webpage.dto';

export class UpdateWebpageDto extends PartialType(CreateWebpageDto) {}
