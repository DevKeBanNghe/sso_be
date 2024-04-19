import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import ms from 'ms';
import _ from 'lodash';

@Injectable()
export class StringUtilService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(16);
  toArray(str: string, split_with: string | RegExp = ',') {
    return str.split(split_with);
  }

  genRandom(length = 6): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  async hashSync(str: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(str, salt);
  }

  async compareHashSync(str: string, hash: string) {
    return await bcrypt.compare(str, hash);
  }

  toMS(str: string) {
    return ms(str);
  }

  encrypt<T>(data: T, expiresIn?: string | number): string {
    if (expiresIn)
      data = {
        ...data,
        createdAt: Date.now(),
        expiresIn: _.isString(expiresIn) ? this.toMS(expiresIn) : expiresIn,
      };
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const encrypted = cipher
      .update(JSON.stringify(data), 'utf8', 'hex')
      .concat(cipher.final('hex'));
    return encrypted;
  }

  decrypt(encrypt_data: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const decrypted = decipher
      .update(encrypt_data, 'hex', 'utf8')
      .concat(decipher.final('utf8'));
    const { createdAt, expiresIn, ...data } = JSON.parse(decrypted);

    if (!createdAt) return data;

    if (Date.now() - createdAt > expiresIn)
      throw new Error('Data encrypt has expired');

    return data;
  }
}
