import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseParamsPaginationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.itemPerPage) value.itemPerPage = parseInt(value.itemPerPage);
    if (value.page) {
      const page = parseInt(value.page);
      value.page = page > 0 ? page : 1;
    }
    return value;
  }
}
