import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  transform(value: any[], metadata: ArgumentMetadata) {
    const transformedArray: number[] = [];

    if (!value) {
      throw new BadRequestException('Array is required');
    }

    for (const item of value) {
      const num = parseFloat(item);
      if (isNaN(num)) {
        throw new BadRequestException('Invalid number in array');
      }
      transformedArray.push(num);
    }

    return transformedArray;
  }
}
