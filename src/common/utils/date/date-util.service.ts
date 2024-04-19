import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  getCurrentDate() {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
}
