import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { KEY_FROM_DECODED_TOKEN } from 'src/consts/jwt.const';

@Injectable()
export class ClearDecodedDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    delete value[KEY_FROM_DECODED_TOKEN];
    return value;
  }
}
