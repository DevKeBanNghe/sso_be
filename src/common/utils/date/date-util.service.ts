import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  getCurrentDate() {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }

  formatDate(date) {
    const data = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
    return data;
  }
}
