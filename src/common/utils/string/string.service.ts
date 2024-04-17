import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import ms from 'ms';

@Injectable()
export class StringService {
  toArray(str: string, split_with: string | RegExp = ',') {
    return str.split(split_with);
  }

  genRandom(length = 6): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  async hash(str: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(str, salt);
  }

  async compareHash(str: string, hash: string) {
    return await bcrypt.compare(str, hash);
  }

  toMS(str: string) {
    return ms(str);
  }
}
