import { Pipe, PipeTransform } from '@angular/core';
import { getHttpsUrl } from '../camo';
import * as cheerio from 'cheerio';

@Pipe({ name: 'html' })
export class HtmlPipe implements PipeTransform {
    transform(value: string): any {
        let $=cheerio.load(value);

        $("img").attr("src",(_i:number,src:string)=>getHttpsUrl(src));
        $("a").map((_i,el)=>{
            let href=(<{[key:string]:string}>el.attribs)["href"];
            if((href.indexOf("http://")===0||href.indexOf("https://")===0)&&
                href.indexOf("https://anontown.com")!==0){
                    //外部リンク
                    (<{[key:string]:string}>el.attribs)["target"]="_blank";
                    return el;
                }else{
                    //内部リンク
                    return el;
                }
        })

        return $.html();
    }
}