import { Component, OnInit, Input } from '@angular/core';
import { Root, mdParse } from "../../md";
import { getHttpsUrl } from '../../camo';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-md',
  templateUrl: './md.component.html',
  styleUrls: ['./md.component.scss']
})
export class MdComponent implements OnInit {
  @Input()
  set text(val: string) {
    this._ast = mdParse(val);
  }

  _ast: Root;
  getHttpsUrl = getHttpsUrl;


  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  getAnontownPath(url: string) {
    return url.replace(/^https:\/\/anontown\.com/, '');
  }

  getYouTubeURL(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + url.match(/(youtube\.com\/watch\?v=|youtu\.be\/)([a-z0-9_]+)/i)[2]);
  }

  urlParse(url: string): 'anontown' | 'normal' | 'img' | 'youtube' {
    if ((url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) || url.indexOf('https://anontown.com') === 0) {
      return 'anontown';
    }

    if (url.match(/(youtube\.com\/watch\?v=|youtu\.be\/)([a-z0-9_]+)/i)) {
      return 'youtube';
    }

    if (url.match(/\.(jpg|jpeg|png|gif|bmp|tif|tiff|svg)$/i)) {
      return 'img';
    }

    return 'normal';
  }

}