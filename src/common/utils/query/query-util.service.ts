import { Injectable } from '@nestjs/common';
import { BuildSearchParams, Operator } from './interfaces/query-util.interface';
@Injectable()
export class QueryUtilService {
  buildSearchQuery<K extends Record<string, boolean>>({
    keys,
    value,
    operator = Operator.OR,
  }: BuildSearchParams<K>): Array<Record<keyof K, any>> {
    let data;
    switch (operator) {
      default:
        data = Object.entries(keys).reduce((acc, [key, isShow]) => {
          if (isShow) {
            acc.push({
              [key]: {
                contains: value,
                mode: 'insensitive',
              },
            });
          }
          return acc;
        }, []);
        break;
    }

    return data;
  }
}
