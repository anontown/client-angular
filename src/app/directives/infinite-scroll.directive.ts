import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  NgZone
} from '@angular/core';
import { InfiniteScrollItemDirective } from './infinite-scroll-item.directive';
import {
  Observable,
  Subscription
} from 'rxjs';
import * as Immutable from 'immutable';

type TItem = { id: string, date: string };

export interface IInfiniteScrollElement {
  el: HTMLElement;
  y: number;
  item: TItem;
}

@Directive({
  selector: '[appInfiniteScroll]',
  exportAs: 'infiniteScroll'
})
export class InfiniteScrollDirective<T extends TItem> implements OnInit, OnDestroy {
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
    //重複IDの要素削除
    this._list = list.filter((x, i) =>
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
   * 最新アイテム設定をリクエスト
   */
  @Input() findNewItem: () => Promise<Immutable.List<T>> =
  () => Promise.resolve(Immutable.List());

  /**
   * 新規アイテム追加をリクエスト
   */
  @Input() findItem: (type: 'before' | 'after', date: string, equal: boolean) => Promise<Immutable.List<T>> =
  () => Promise.resolve(Immutable.List());

  @Input() afterViewChecked: Observable<void>;

  /**
   * 新しいアイテムを追加する時のスクロール幅の遊び
   */
  @Input() width = 10;

  /**
   * スクロールが止まって何ミリ秒後に更新イベントを送るか
   */
  @Input() debounceTime = 500;

  @Input() autoScrollSpeed = 15;

  @Input() isAutoScroll = false;

  @Output()
  scrollNewItemChange = new EventEmitter<TItem>();

  @Input()
  set scrollNewItem(val: TItem | null) {
    (async () => {
      if (val) {
        await this._lock(async () => {
          this.list = await this.findItem('before', val.date, true);

          await this.afterViewChecked.take(1).toPromise();

          switch (this.newItem) {
            case 'top':
              await this.toTop();
              break;
            case 'bottom':
              await this.toBottom();
              break;
          }
        });

        await this.findAfter();
      } else {
        await this.findNew();
      }
    })();
  }

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
  private _updateNew$: Observable<T> = Observable.empty<T>();
  private _updateNewSub = this._updateNew$.subscribe();
  @Input()
  set updateNew$(val: Observable<T>) {
    this._updateNewSub.unsubscribe();
    this._updateNewSub = val.subscribe((item) => {
      this.list = this.list.push(item);
    });
    this._updateNew$ = val;
  }
  get updateNew$() {
    return this._updateNew$;
  }

  @ContentChildren(InfiniteScrollItemDirective) items: QueryList<InfiniteScrollItemDirective>;

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
        //最短距離のアイテム
        let minItem: InfiniteScrollItemDirective | null = null;
        this.items
          .forEach(x => {
            if (minItem === null) {
              minItem = x;
            } else if (Math.abs(minItem.el.getBoundingClientRect().top + minItem.el.getBoundingClientRect().height / 2) >
              Math.abs(x.el.getBoundingClientRect().top + x.el.getBoundingClientRect().height / 2)) {
              minItem = x;
            }
          });

        resolve({
          el: minItem!.el,
          y: minItem!.el.offsetTop + minItem!.el.offsetHeight / 2,
          item: {
            id: minItem!.id,
            date: minItem!.date,
          }
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
        let minItem: InfiniteScrollItemDirective | null = null;
        this.items
          .forEach(x => {
            if (minItem === null) {
              minItem = x;
            } else if (Math.abs(window.innerHeight - (minItem.el.getBoundingClientRect().top + minItem.el.getBoundingClientRect().height / 2)) >
              Math.abs(window.innerHeight - (x.el.getBoundingClientRect().top + minItem.el.getBoundingClientRect().height / 2))) {
              minItem = x;
            }
          });

        resolve({
          el: minItem!.el,
          y: minItem!.el.offsetTop + minItem!.el.offsetHeight / 2,
          item: {
            id: minItem!.id,
            date: minItem!.date,
          }
        });
      }, 0);
    }));
  }

  private subscriptions: Subscription[] = [];

  el: HTMLElement;

  constructor(el: ElementRef,
    private zone: NgZone) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
        .map(() => this.el.scrollTop)
        .filter(top => top <= this.width)
        .debounceTime(this.debounceTime)
        .subscribe(() => {
          this.zone.run(() => {
            switch (this.newItem) {
              case 'top':
                this.findAfter();
                break;
              case 'bottom':
                this.findBefore();
                break;
            }
          });
        }));

      this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
        .map(() => this.el.scrollTop + this.el.clientHeight)
        .filter(bottom => bottom >= this.el.scrollHeight - this.width)
        .debounceTime(this.debounceTime)
        .subscribe(() => {
          this.zone.run(() => {
            switch (this.newItem) {
              case 'bottom':
                this.findAfter();
                break;
              case 'top':
                this.findBefore();
                break;
            }
          });
        }));

      this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
        .debounceTime(this.debounceTime)
        .subscribe(async () => {
          let newItem = this.newItem === 'top' ? await this.getTopElement() : await this.getBottomElement();
          this.scrollNewItemChange.emit(newItem.item);
        }));

      this.subscriptions.push(Observable
        .interval(100)
        .subscribe(() => {
          if (this.isAutoScroll) {
            this.el.scrollTop += this.autoScrollSpeed;
          }
        }));
    });
  }

  ngOnDestroy() {
    this._updateItemSub.unsubscribe();
    this._updateNewSub.unsubscribe();
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

  private async findAfter(): Promise<void> {
    if (this.list.size === 0) {
      await this.findNew();
    } else {
      await this._lock(async () => {
        let ise: IInfiniteScrollElement;
        switch (this.newItem) {
          case 'bottom':
            ise = await this.getBottomElement();
            break;
          case 'top':
            ise = await this.getTopElement();
            break;
        }

        this.list = this.list
          .concat(await this.findItem('after', this._list.last().date, false))
          .toList();

        await this.afterViewChecked.take(1).toPromise();

        switch (this.newItem) {
          case 'bottom':
            await this.setBottomElement(ise);
            break;
          case 'top':
            await this.setTopElement(ise);
            break;
        }
      });
    }
  }

  private async findBefore(): Promise<void> {
    if (this.list.size === 0) {
      await this.findNew();
    } else {
      await this._lock(async () => {
        let ise: IInfiniteScrollElement;
        switch (this.newItem) {
          case 'bottom':
            ise = await this.getTopElement();
            break;
          case 'top':
            ise = await this.getBottomElement();
            break;
        }

        this.list = this.list
          .concat(await this.findItem('before', this._list.first().date, false))
          .toList();

        await this.afterViewChecked.take(1).toPromise();

        switch (this.newItem) {
          case 'bottom':
            await this.setTopElement(ise);
            break;
          case 'top':
            await this.setBottomElement(ise);
            break;
        }
      });
    }
  }

  private async findNew(): Promise<void> {
    await this._lock(async () => {
      this.list = await this.findNewItem();

      await this.afterViewChecked.take(1).toPromise();

      switch (this.newItem) {
        case 'bottom':
          await this.toBottom();
          break;
        case 'top':
          await this.toTop();
          break;
      }
    });
  }
}

