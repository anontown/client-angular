import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appInfiniteScroll]',
  exportAs:"infiniteScroll"
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Output()
  scrollTop = new EventEmitter();

  @Output()
  scrollBottom = new EventEmitter();

  @Input()
  width = 10;

  @Input()
  wait = 500;


  setTopElement(el: HTMLElement):Promise<void> {
    return new Promise<void>((resolve => {
      setTimeout(() => {
        document.body.scrollTop = el.offsetTop;
        resolve();
      }, 0)
    }));
  }

  getTopElement(): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve => {
      setTimeout(() => {
        //最短距離のエレメント
        let minEl: HTMLElement = null;
        Array.from((<HTMLElement>this.el.nativeElement).children)
          .forEach((x: HTMLElement) => {
            if (minEl === null) {
              minEl = x;
            } else if (Math.abs(minEl.getBoundingClientRect().top) >
              Math.abs(x.getBoundingClientRect().top)) {
              minEl = x;
            }
          });

        resolve(minEl);
      }, 0);
    }));
  }

  @Output()
  topElementChange = new EventEmitter<Element>();

  private subscriptions: Subscription[] = [];

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.subscriptions.push(Observable.fromEvent(window, "scroll")
      .map(() => <ClientRect>this.el.nativeElement.getBoundingClientRect())
      .filter(x => x.top >= -this.width)
      .debounceTime(this.wait)
      .subscribe(() => {
        this.scrollTop.emit();
      }));

    this.subscriptions.push(Observable.fromEvent(window, "scroll")
      .map(() => <ClientRect>this.el.nativeElement.getBoundingClientRect())
      .filter(x => x.bottom <= window.innerHeight + this.width)
      .debounceTime(this.wait)
      .subscribe(() => {
        this.scrollBottom.emit();
      }));

    this.subscriptions.push(Observable.fromEvent(window, "scroll")
      .debounceTime(this.wait)
      .subscribe(async() => {
        this.topElementChange.emit(await this.getTopElement());
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}

