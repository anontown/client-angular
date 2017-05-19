import {
  Directive,
  Input,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScrollItem]'
})
export class InfiniteScrollItemDirective {
  @Input('itemId') _id: string;
  @Input('itemDate') _date: number | string | Date;

  private el: HTMLElement;

  get id(): string {
    return this._id;
  }

  get date(): Date {
    if (typeof this._date === 'string') {
      return new Date(this._date)
    } else if (typeof this._date === 'number') {
      return new Date(this._date);
    } else {
      return this._date;
    }
  }

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