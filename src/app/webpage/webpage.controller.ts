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
import { UpdateWebpageDto } from './dto/update-webpage.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import { GetWebpageListByPaginationDto } from './dto/get-webpage.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { Webpage } from './entities/webpage.entity';

@Controller('webpages')
export class WebpageController {
  constructor(private readonly WebpageService: WebpageService) {}

  @Post()
  @UsePipes(ClearDecodedDataPipe)
  createWebpage(@Body() createDto: CreateWebpageDto) {
    return this.WebpageService.create(createDto);
  }

  @Put()
  @UsePipes(ClearDecodedDataPipe)
  updateWebpage(@Body() updateDto: UpdateWebpageDto) {
    return this.WebpageService.update(updateDto);
  }

  @Get()
  @UsePipes(ClearDecodedDataPipe, ParseParamsPaginationPipe)
  getWebpageList(
    @Query() getListByPaginationDto: GetWebpageListByPaginationDto
  ) {
    return this.WebpageService.getList(getListByPaginationDto);
  }

  @Get(':id')
  @UsePipes(ClearDecodedDataPipe)
  getWebpageDetail(@Param('id') id: Webpage['webpage_id']) {
    return this.WebpageService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteWebpages(@Query('ids') ids: Webpage['webpage_id'][]) {
    return this.WebpageService.remove(ids);
  }
}
