import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'atDate', pure: false })
export class AtDatePipe implements PipeTransform {
  transform(value: Date | string | number): any {
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value as any);
    }

    let timespan = Date.now() - date.valueOf();

    //一秒未満
    if (timespan < 1000) {
      return '現在';
    }

    //一分未満
    if (timespan < 60 * 1000) {
      return Math.floor(timespan / 1000) + '秒前';
    }

    //一時間未満
    if (timespan < 60 * 60 * 1000) {
      return Math.floor(timespan / 1000 / 60) + '分前';
    }

    //一日未満
    if (timespan < 24 * 60 * 60 * 1000) {
      return Math.floor(timespan / 1000 / 60 / 24) + '時間前';
    }

    return ('0000' + date.getFullYear()).slice(-4)
      + '/'
      + ('00' + (date.getMonth() + 1)).slice(-2)
      + '/'
      + ('00' + date.getDate()).slice(-2)
      + '(' + ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] + ') '
      + ('00' + date.getHours()).slice(-2)
      + ':'
      + ('00' + date.getMinutes()).slice(-2);
  }
}