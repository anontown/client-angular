import { Pipe, PipeTransform } from '@angular/core';
import { getHttpsUrl } from '../camo';
import * as cheerio from 'cheerio';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'html' })
export class HtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {

  }

  transform(value: string): any {
    let $ = cheerio.load(value);

    //見出しのID削除
    $(':header').removeAttr('id');

    $('a').each(function (this: any) {
      let el = $(this);
      let href = el.attr('href');
      if ((href.indexOf('http://') === 0 || href.indexOf('https://') === 0) &&
        href.indexOf('https://anontown.com') !== 0) {
        //外部リンク
        let reqArray: RegExpMatchArray | null;
        if (reqArray = href.match(/(youtube\.com\/watch\?v=|youtu\.be\/)([a-z0-9_]+)/i)) {
          //youtube
          let youtubeID = reqArray[2];
          let frame = $('<iframe></iframe>');

          frame.attr('src', 'https://www.youtube.com/embed/' + youtubeID);
          frame.attr('frameborder', '0');
          el.replaceWith($('<div>')
            .addClass('youtube')
            .append(frame));
        } else if (href.match(/\.(jpg|jpeg|png|gif|bmp|tif|tiff|svg)$/i)) {
          //画像
          let img = $('<img></img>');
          img.attr('src', href);
          el.replaceWith(img);
        } else {
          //ただの外部リンク
          el.attr('target', '_blank');
        }
      } else {
        //内部リンク
      }
    });

    $('img').attr('src', (_i: number, src: string) => getHttpsUrl(src));

    return this.sanitizer.bypassSecurityTrustHtml($.html());
  }
}