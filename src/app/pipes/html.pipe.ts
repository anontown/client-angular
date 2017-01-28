import { Pipe, PipeTransform } from '@angular/core';
import { getHttpsUrl } from '../camo';
import * as cheerio from 'cheerio';

@Pipe({ name: 'html' })
export class HtmlPipe implements PipeTransform {
    transform(value: string): any {
        let $=cheerio.load(value);

        $("img").attr("src",(_i:number,src:string)=>getHttpsUrl(src));

        return $.html();
    }
}