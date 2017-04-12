import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  NgZone,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import * as socketio from 'socket.io-client';
import { MdDialog } from '@angular/material';

import { InfiniteScrollDirective, IInfiniteScrollElement } from '../../directives';
import { Config } from '../../config';
import {
  UserService,
  ResponsiveService,
  ITopicAPI,
  AtApiService,
  IResAPI,
  ITopicNormalAPI
} from '../../services';
import {
  TopicAutoScrollMenuDialogComponent,
  ResWriteDialogComponent,
  TopicDataDialogComponent,
  TopicEditDialogComponent,
  TopicForkDialogComponent
} from '../../dialogs';
import { ActivatedRoute } from '@angular/router';
import { ResComponent } from '../../components';
import * as Immutable from 'immutable';
import { MdSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  topic:ITopicAPI;

  @ViewChildren('resE') resE: QueryList<ResComponent>;

  private reses = Immutable.List<IResAPI>();
  private limit = 50;

  // 全レス読んだか
  private isReadAllNew = false;
  private isReadAllOld = false;

  private intervalID: any;

  constructor(
    public user: UserService,
    private api: AtApiService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dialog: MdDialog,
    public snackBar: MdSnackBar,
    private cdr: ChangeDetectorRef,
    public rs: ResponsiveService,
    private router: Router,
    private titleService: Title) {
  }



  // 他のレスを取得している間はロック
  private isLock = false;
  private async lock(call: () => Promise<void>) {
    if (this.isLock) {
      return;
    }
    this.isLock = true;
    try {
      await call();
    } catch (e) {
      this.isLock = false;
      throw e;
    }
    // レス数が変わっているはずなので更新
    try {
      this.topic = await this.api.findTopicOne({ id: this.topic.id });
    } catch (_e) {
      this.snackBar.open('トピック取得に失敗');
    }
    this.isLock = false;
  }

  updateRes(res: IResAPI) {
    this.reses = this.reses.set(this.reses.findIndex((r) => r.id === res.id), res);
  }

  autoScrollSpeed = 15;
  private isAutoScroll = false;
  autoScroll() {
    this.isAutoScroll = !this.isAutoScroll;
  }
  async autoScrollMenu() {
    let dialog = this.dialog.open(TopicAutoScrollMenuDialogComponent);
    let con = dialog.componentInstance;
    con.autoScrollSpeed = this.autoScrollSpeed;
    con.isAutoScroll = this.isAutoScroll;
    await dialog.afterClosed().toPromise();
    this.autoScrollSpeed = con.autoScrollSpeed;
    this.isAutoScroll = con.isAutoScroll;
  }

  writeMenu(res: IResAPI) {
    let dialog = this.dialog.open(ResWriteDialogComponent);
    let com = dialog.componentInstance;
    com.topic = this.topic;
    com.reply = res;
  }

  update(topic: ITopicAPI) {
    this.topic = topic;
  }

  openData() {
    let dialog = this.dialog.open(TopicDataDialogComponent);
    dialog.componentInstance.topic = this.topic;
  }

  openEdit() {
    let dialog = this.dialog.open(TopicEditDialogComponent);
    dialog.componentInstance.topic = this.topic as ITopicNormalAPI;
    dialog.afterClosed()
      .filter(x => x)
      .subscribe(x => this.topic = x);
  }


  private socket: SocketIOClient.Socket;

  afterViewChecked = new Subject<void>();
  ngAfterViewChecked() {
    this.afterViewChecked.next();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.storageSave(null);
    clearInterval(this.intervalID);
    this.socket.close();
  }

  async ngOnInit() {
    let first = true;
    this.route.params.forEach(async (params) => {
      if (!first) {
        this.isReadAllNew = false;
        this.isReadAllOld = false;
        this.ngOnDestroy();
      }
      first = false;

      let id = params["id"];
      try {
        this.topic = await this.api.findTopicOne({ id });
        this.titleService.setTitle(this.topic.title);
      } catch (_e) {
        this.snackBar.open("トピック取得に失敗");
      }

      let isInit = false;
      this.subscriptions.push(this.user.ud.subscribe(async (ud) => {
        if (isInit) {
          return;
        }
        isInit = true;
        if (ud !== null && ud.storage.topicRead.has(this.topic.id)) {
          //読んだことあるなら続きから
          try {
            await this.lock(async () => {
              let reses = await this.api.findRes(ud.auth,
                {
                  topic: this.topic.id,
                  type: "before",
                  equal: true,
                  date: (await this.api.findResOne(ud.auth, { id: (ud.storage.topicRead.get(this.topic.id).res) })).date,
                  limit: this.limit
                })
              if (reses.length !== this.limit) {
                this.isReadAllOld = true;
              }
              this.reses = Immutable.List(reses);
              await this.iScroll.toBottom();
            });
          } catch (_e) {
            this.snackBar.open("レス取得に失敗");
          }
          this.afterViewChecked
            .take(1)
            .subscribe(() => this.readNew());
        } else {
          //読んだことないなら最新レス
          try {
            await this.findNew();
          } catch (_e) {
            this.snackBar.open("レス取得に失敗");
          }
        }
      }));

      this.zone.runOutsideAngular(() => {
        this.intervalID = setInterval(() => {
          if (this.isAutoScroll) {
            this.scrollEl.nativeElement.scrollTop += this.autoScrollSpeed;
          }
        }, 100);
      });

      //自動更新
      this.socket = socketio.connect(Config.serverURL, { forceNew: true });
      this.socket.emit("topic-join", this.topic.id);
      this.socket.on("topic", (msg: string) => {
        if (msg === this.topic.id) {
          this.isReadAllNew = false;
          this.readNew();
        }
      });
    });
  }

  @ViewChild('scrollEl')
  scrollEl: ElementRef;

  scrollSave(iel: IInfiniteScrollElement) {
    if (iel === null || !this.user.ud.getValue()) {
      return;
    }
    let rc = this.resE.find(x => x.elementRef.nativeElement === iel.el);
    if (!rc) {
      return;
    }

    this.storageSave(rc.res.id);
  }

  storageSave(res: string) {
    let ud = this.user.ud.getValue();
    if (!ud) {
      return;
    }
    if (res === null) {
      if (ud.storage.topicRead.has(this.topic.id)) {
        res = ud.storage.topicRead.get(this.topic.id).res;
      } else {
        if (this.reses.size === 0) {
          return;
        }
        res = this.reses.first().id;
      }
    }
    let storage = ud.storage;
    storage.topicRead = storage.topicRead.set(this.topic.id, {
      res: res,
      count: this.topic.resCount
    })
    this.user.ud.next(ud);
  }

  private subscriptions: Subscription[] = [];

  private async findNew() {
    let ud = this.user.ud.getValue();
    try {
      await this.lock(async () => {
        let reses = await this.api.findResNew(ud ? ud.auth : null,
          {
            topic: this.topic.id,
            limit: this.limit
          });
        if (reses.length !== this.limit) {
          this.isReadAllNew = true;
        }
        this.reses = Immutable.List(reses);
        await this.iScroll.toBottom();
      });
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  @ViewChild("iScroll")
  iScroll: InfiniteScrollDirective;

  openFork() {
    let dia = this.dialog.open(TopicForkDialogComponent);
    dia.componentInstance.topic = this.topic as ITopicNormalAPI;
    dia.afterClosed().subscribe(id => {
      if (id) {
        setTimeout(() => {
          this.router.navigate(['/topic', id]);
        }, 500);
      }
    });
  }

  async readNew() {
    let ud = this.user.ud.getValue();
    if (this.isReadAllNew) {
      return;
    }
    try {
      if (this.reses.size === 0) {
        this.findNew();
      } else {
        await this.lock(async () => {
          let reses = await this.api.findRes(ud ? ud.auth : null,
            {
              topic: this.topic.id,
              type: "after",
              equal: false,
              date: this.reses.first().date,
              limit: this.limit
            }
          );
          if (reses.length !== this.limit) {
            this.isReadAllNew = true;
          }
          this.reses = Immutable.List(reses.concat(this.reses.toArray()));
        });
      }
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  async readOld() {
    let ud = this.user.ud.getValue();
    if (this.isReadAllOld) {
      return;
    }
    try {
      if (this.reses.size === 0) {
        this.findNew();
      } else {
        //一番下のレスと座標を取得
        let el = await this.iScroll.getTopElement();

        await this.lock(async () => {
          let reses = await this.api.findRes(ud ? ud.auth : null,
            {
              topic: this.topic.id,
              type: "before",
              equal: false,
              date: this.reses.last().date,
              limit: this.limit
            }
          );
          if (reses.length !== this.limit) {
            this.isReadAllOld = true;
          }
          this.reses = Immutable.List(this.reses.toArray().concat(reses));

          if (el) {
            this.iScroll.setTopElement(el);
          }
        });
      }
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  async favo() {
    let ud = this.user.ud.getValue();
    let storage = ud.storage;
    let tf = storage.topicFavo;
    storage.topicFavo = this.isFavo ? tf.delete(this.topic.id) : tf.add(this.topic.id);
    this.user.ud.next(ud);
  }

  get isFavo(): boolean {
    return this.user.ud.getValue().storage.topicFavo.has(this.topic.id)
  }
}