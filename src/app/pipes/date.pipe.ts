import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'atDate' })
export class AtDatePipe implements PipeTransform {
  transform(value: Date | string | number): any {
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value as any);
    }
    return ('0000' + date.getFullYear()).slice(-4)
      + '/'
      + ('00' + (date.getMonth() + 1)).slice(-2)
      + '/'
      + ('00' + date.getDate()).slice(-2)
      + '(' + ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] + ') '
      + ('00' + date.getHours()).slice(-2)
      + ':'
      + ('00' + date.getMinutes()).slice(-2)
      + ':'
      + ('00' + date.getSeconds()).slice(-2)
      + '.'
      + ('000' + date.getMilliseconds()).slice(-3)
  }
}