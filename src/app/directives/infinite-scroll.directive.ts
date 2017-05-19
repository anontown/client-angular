import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';
import { InfiniteScrollItemDirective } from './infinite-scroll-item.directive';
import { Observable, Subscription } from 'rxjs';
import * as Immutable from 'immutable';

export interface IInfiniteScrollElement {
  el: HTMLElement;
  y: number;
}

@Directive({
  selector: '[appInfiniteScroll]',
  exportAs: 'infiniteScroll'
})
export class InfiniteScrollDirective<T extends { id: string, date: string }> implements OnInit, OnDestroy {
  /**
   * アイテムリスト
   * 新しいアイテムが下
   */
  private _list = Immutable.List<T>();

  /**
   * アイテムリスト取得
   * 並び順はnewItemプロパティで決まる
   */
  get list(): Immutable.List<T> {
    return this.newItem === 'bottom' ?
      this._list :
      this._list.reverse().toList();
  }

  /**
   * アイテムリスト設定
   * 重複要素削除、ソートが行われる
   */
  set list(list: Immutable.List<T>) {
    this._list =
      //重複IDの要素削除
      list.filter((x, i) =>
        list.findIndex(y => x.id === y.id) === i)
        //ソート
        .sort((a, b) => {
          let aDate = new Date(a.date).valueOf();
          let bDate = new Date(b.date).valueOf();
          if (aDate > bDate) {
            return 1;
          } else if (aDate < bDate) {
            return -1;
          } else {
            return 0;
          }
        })
        //リストに変換
        .toList();
  }

  /**
   * 新着アイテムを上に表示するか下に表示するか
   */
  @Input() newItem: 'top' | 'bottom' = 'top';

  /**
   * 初期化アイテム設定をリクエスト
   */
  @Input() findInitItem: () => Promise<Immutable.List<T>> =
  () => Promise.resolve(Immutable.List());

  /**
   * 新規アイテム追加をリクエスト
   */
  @Input() findNewItem: (max: string) => Promise<Immutable.List<T>> =
  () => Promise.resolve(Immutable.List());

  /**
   * 古いアイテム追加をリクエスト
   */
  @Input() findOldItem: (min: string) => Promise<Immutable.List<T>> =
  () => Promise.resolve(Immutable.List());

  /**
   * 新しいアイテムを追加する時のスクロール幅の遊び
   */
  @Input() width = 10;

  /**
   * スクロールが止まって何ミリ秒後に更新イベントを送るか
   */
  @Input() debounceTime = 500;

  /**
   * アイテム更新Observable
   */
  private _updateItem$: Observable<T> = Observable.empty<T>();
  private _updateItemSub = this._updateItem$.subscribe();
  @Input()
  set updateItem$(val: Observable<T>) {
    this._updateItemSub.unsubscribe();
    this._updateItemSub = val.subscribe((item) => {
      let index = this.list.findIndex(x => x.id === item.id);
      if (index !== -1) {
        this.list = this.list.set(index, item);
      }
    });
    this._updateItem$ = val;
  }
  get updateItem$() {
    return this._updateItem$;
  }

  /**
   * websocket等の新着更新通知Observable
   */
  private _updateNew$: Observable<void> = Observable.empty<void>();
  private _updateNewSub = this._updateNew$.subscribe();
  @Input()
  set updateNew$(val: Observable<void>) {
    this._updateNewSub.unsubscribe();
    this._updateNewSub = val.subscribe(() => {
      this.findNew();
    });
    this._updateNew$ = val;
  }
  get updateNew$() {
    return this._updateNew$;
  }

  @ViewChildren(InfiniteScrollItemDirective) items: QueryList<InfiniteScrollItemDirective>;

  toTop(): Promise<void> {
    return new Promise<void>((ok) => {
      setTimeout(() => {
        this.el.scrollTop = 0;
        ok();
      });
    });
  }

  toBottom(): Promise<void> {
    return new Promise<void>((ok) => {
      setTimeout(() => {
        this.el.scrollTop = this.el.scrollHeight;
        ok();
      });
    });
  }

  setTopElement(iel: IInfiniteScrollElement): Promise<void> {
    return new Promise<void>((resolve => {
      setTimeout(() => {
        this.el.scrollTop += (iel.el.offsetTop + iel.el.offsetHeight / 2) - iel.y;
        resolve();
      });
    }));
  }

  getTopElement(): Promise<IInfiniteScrollElement> {
    return new Promise<IInfiniteScrollElement>((resolve => {
      setTimeout(() => {
        //最短距離のエレメント
        let minEl: HTMLElement | null = null;
        Array.from(this.el.children)
          .forEach((x: HTMLElement) => {
            if (minEl === null) {
              minEl = x;
            } else if (Math.abs(minEl.getBoundingClientRect().top + minEl.getBoundingClientRect().height / 2) >
              Math.abs(x.getBoundingClientRect().top + x.getBoundingClientRect().height / 2)) {
              minEl = x;
            }
          });

        resolve({
          el: minEl!,
          y: minEl!.offsetTop + minEl!.offsetHeight / 2,
        });
      });
    }));
  }

  setBottomElement(iel: IInfiniteScrollElement): Promise<void> {
    return new Promise<void>((resolve => {
      setTimeout(() => {
        this.el.scrollTop += (iel.el.offsetTop + iel.el.offsetHeight / 2) - iel.y;
        resolve();
      }, 0);
    }));
  }

  getBottomElement(): Promise<IInfiniteScrollElement> {
    return new Promise<IInfiniteScrollElement>((resolve => {
      setTimeout(() => {
        //最短距離のエレメント
        let minEl: HTMLElement | null = null;
        Array.from(this.el.children)
          .forEach((x: HTMLElement) => {
            if (minEl === null) {
              minEl = x;
            } else if (Math.abs(
              window.innerHeight -
              (minEl.getBoundingClientRect().top +
                minEl.getBoundingClientRect().height / 2)
            ) >
              Math.abs(
                window.innerHeight -
                (x.getBoundingClientRect().top +
                  minEl.getBoundingClientRect().height / 2)
              )) {
              minEl = x;
            }
          });

        resolve({
          el: minEl!,
          y: minEl!.offsetTop + minEl!.offsetHeight / 2,
        });
      }, 0);
    }));
  }

  @Output()
  elementChange = new EventEmitter<{ top: IInfiniteScrollElement, bottom: IInfiniteScrollElement }>();

  private subscriptions: Subscription[] = [];

  el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .map(() => this.el.scrollTop)
      .filter(top => top <= this.width)
      .debounceTime(this.debounceTime)
      .subscribe(() => {
        this.scrollTop.emit();
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .map(() => this.el.scrollTop + this.el.clientHeight)
      .filter(bottom => bottom >= this.el.scrollHeight - this.width)
      .debounceTime(this.debounceTime)
      .subscribe(() => {
        this.scrollBottom.emit();
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .debounceTime(this.debounceTime)
      .subscribe(async () => {
        this.elementChange.emit({
          top: await this.getTopElement(),
          bottom: await this.getBottomElement()
        });
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private _isLock = false;
  private async _lock(call: () => Promise<void>): Promise<void> {
    if (this._isLock) {
      return;
    }

    this._isLock = true;
    try {
      await call();
    } catch (e) {
      console.log(e);
    }
    this._isLock = false;
  }

  private async findNew(): Promise<void> {
    if (this.list.size === 0) {
      await this.findInit();
    } else {
      await this._lock(async () => {
        this.list = await this.findNewItem(this._list.last().date);
      });
    }
  }

  private async findOld(): Promise<void> {
    if (this.list.size === 0) {
      await this.findInit();
    } else {
      await this._lock(async () => {
        this.list = await this.findOldItem(this._list.first().date);
      });
    }
  }

  private async findInit(): Promise<void> {
    await this._lock(async () => {
      this.list = await this.findInitItem();
    });
  }
}

