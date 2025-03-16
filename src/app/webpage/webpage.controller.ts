import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { WebpageService } from './webpage.service';
import { CreateWebpageDto } from './dto/create-webpage.dto';
import {
  UpdateActivateStatusDto,
  UpdateWebpageDto,
} from './dto/update-webpage.dto';
import { GetWebpageListByPaginationDto } from './dto/get-webpage.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { Webpage } from '@prisma-postgresql/models';

@Controller('webpages')
export class WebpageController {
  constructor(private readonly webpageService: WebpageService) {}

  @Post()
  createWebpage(@Body() createDto: CreateWebpageDto) {
    return this.webpageService.create(createDto);
  }

  @Put()
  updateWebpage(@Body() updateDto: UpdateWebpageDto) {
    return this.webpageService.update(updateDto);
  }

  @Get()
  @UsePipes(ParseParamsPaginationPipe)
  getWebpageList(
    @Query() getListByPaginationDto: GetWebpageListByPaginationDto
  ) {
    return this.webpageService.getList(getListByPaginationDto);
  }

  @Get(':id')
  getWebpageDetail(@Param('id') id: Webpage['webpage_id']) {
    return this.webpageService.getDetail(id);
  }

  @Delete()
  deleteWebpages(@Query('ids') ids: Webpage['webpage_id'][]) {
    return this.webpageService.remove(ids);
  }

  @Put('activate-status')
  updateActivateStatus(@Body() payload: UpdateActivateStatusDto) {
    return this.webpageService.updateActivateStatus(payload);
  }
}
