import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  getCurrentDate(format: Intl.DateTimeFormatOptions) {
    return this.formatDate(new Date(), format);
  }

  formatDate(
    date,
    format: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
  ) {
    const data = new Intl.DateTimeFormat('en-GB', format).format(date);
    return data;
  }
}
