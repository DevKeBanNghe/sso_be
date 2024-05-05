import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Put,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { WebpageService } from './webpage.service';
import { CreateWebpageDto } from './dto/create-webpage.dto';
import { UpdateWebpageDto } from './dto/update-webpage.dto';
import { ClearDecodedDataPipe } from 'src/common/pipes/clear-decoded-data.pipe';
import {
  GetWebpageListByPaginationDto,
  GetWebpageOptionsDto,
} from './dto/get-webpage.dto';
import { ParseParamsPaginationPipe } from 'src/common/pipes/parse-params-pagination.pipe';
import { ParseIntArrayPipe } from 'src/common/pipes/parse-int-array.pipe';

@Controller('webpages')
export class WebpageController {
  constructor(private readonly WebpageService: WebpageService) {}

  @Get('/options')
  getOptions(@Body() getOptionsDto: GetWebpageOptionsDto) {
    return this.WebpageService.getOptions(getOptionsDto);
  }

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
  getWebpageDetail(@Param('id', ParseIntPipe) id: number) {
    return this.WebpageService.getDetail(id);
  }

  @Delete()
  @UsePipes(ClearDecodedDataPipe)
  deleteWebpages(@Query('ids', ParseIntArrayPipe) ids: number[]) {
    return this.WebpageService.remove(ids);
  }
}
