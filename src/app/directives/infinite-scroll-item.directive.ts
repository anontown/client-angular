import {
  Directive,
  Input,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScrollItem]'
})
export class InfiniteScrollItemDirective {
  @Input('itemId') id: string;
  @Input('itemDate') date: string;

  el: HTMLElement;

  get height(): number {
    return this.el.offsetHeight;
  }

  get top(): number {
    return this.el.offsetTop;
  }

  get bottom(): number {
    return this.top + this.height;
  }

  get y(): number {
    return this.top + this.height / 2;
  }

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

}