import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  NgZone,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as socketio from 'socket.io-client';
import { MdDialog } from '@angular/material';
import {
  Topic,
  AtApiService,
  Res,
} from 'anontown';
import { Config } from '../../config';
import { UserService, ResponsiveService } from '../../services';
import {
  TopicAutoScrollMenuDialogComponent,
  ResWriteDialogComponent
} from '../../dialogs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResComponent } from '../../components';
import * as Immutable from 'immutable';
import { MdSnackBar } from '@angular/material';

@Component({
  templateUrl: './topic.page.component.html',
  styleUrls: ['./topic.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  topic: Topic;

  @ViewChildren('resE') resE: QueryList<ResComponent>;

  private reses = Immutable.List<Res>();
  private limit = 50;

  //全レス読んだか
  private isReadAllNew = false;
  private isReadAllOld = false;

  constructor(
    private user: UserService,
    private api: AtApiService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dialog: MdDialog,
    public snackBar: MdSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public rs: ResponsiveService) {
  }

  private isIOS = navigator.userAgent.match(/iPhone|iPad/);

  private intervalID: any;

  //他のレスを取得している間はロック
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
    //レス数が変わっているはずなので更新
    try {
      this.topic = await this.api.findTopicOne({ id: this.topic.id });
    } catch (_e) {
      this.snackBar.open("トピック取得に失敗");
    }
    this.isLock = false;
  }

  updateRes(res: Res) {
    this.reses = this.reses.set(this.reses.findIndex((r) => r.id === res.id), res);
  }

  autoScrollSpeed = 10;
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

  writeMenu() {
    if (!this.isIOS) {
      let dialog = this.dialog.open(ResWriteDialogComponent);
      let com = dialog.componentInstance;
      com.topic = this.topic;
      com.reply = null;
    } else {
      this.router.navigate(['topic', this.topic.id, 'write']);
    }
  }

  update(topic: Topic) {
    this.topic = topic;
  }


  private socket: SocketIOClient.Socket;

  //次のビュー更新で最新レスを読み込むか
  private isReadNew = false;
  ngAfterViewChecked() {
    if (this.isReadNew) {
      this.readNew();
      this.isReadNew = false;
    }
  }


  private isDestroy=false;
  ngOnDestroy() {
    this.isDestroy=true;
    this.subscriptions.forEach(x => x.unsubscribe);
    this.storageSave(null);
    clearInterval(this.intervalID);
    this.socket.close();
  }

  async ngOnInit() {
    let id: string = "";
    this.route.params.forEach((params) => {
      id = params["id"];
    });

    try {
      this.topic = await this.api.findTopicOne({ id });
      document.title = this.topic.title;
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
          });
        } catch (_e) {
          this.snackBar.open("レス取得に失敗");
        }
        this.isReadNew = true;
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
          document.body.scrollTop -= this.autoScrollSpeed;
        }
      }, 200);

      this.subscriptions.push(Observable.fromEvent(window, "scroll")
        .throttleTime(1000)
        .subscribe(() => {
          if(this.isDestroy){
            return;
          }
          this.scrollSave();
        }));

      this.subscriptions.push(Observable.fromEvent(window, "scroll")
        .map(() => window.scrollY)
        .filter(x => x + 10 >= document.body.clientHeight - window.innerHeight)
        .debounceTime(500)
        .subscribe(() => {
          this.readOld();
        }));
    });

    this.subscriptions.push(Observable.fromEvent(window, "scroll")
      .map(() => window.scrollY)
      .filter(x => x <= 10)
      .debounceTime(500)
      .subscribe(() => {
        this.readNew();
      }));

    //自動更新
    this.socket = socketio.connect(Config.serverURL, { forceNew: true });
    this.socket.emit("topic-join", this.topic.id);
    this.socket.on("topic", (msg: string) => {
      if (msg === this.topic.id) {
        this.isReadAllNew = false;
        this.readNew();
      }
    });
  }

  private scrollSave() {
    if (this.user.ud.getValue()) {
      //最短距離のレスID
      var res: Res;
      {
        let getTop = (rc: ResComponent) => rc.elementRef.nativeElement.getBoundingClientRect().top;
        //最短
        let rc: ResComponent | null = null;
        this.resE.forEach(x => {
          if (rc === null) {
            rc = x;
          } else if (Math.abs(getTop(rc)) > Math.abs(getTop(x))) {
            rc = x;
          }
        });
        if (rc === null) {
          return;
        }
        res = (rc as ResComponent).res;
      }
      //セット
      this.storageSave(res.id);
    }
  }

  storageSave(res:string){
    let ud=this.user.ud.getValue();
    if (!ud) {
      return;
    }
    if(res===null){
      res=ud.storage.topicRead.get(this.topic.id).res;
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
    let ud=this.user.ud.getValue();
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
      });
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  async readNew() {
    let ud=this.user.ud.getValue();
    if (this.isReadAllNew) {
      return;
    }
    try {
      if (this.reses.size === 0) {
        this.findNew();
      } else {
        await this.lock(async () => {
          //一番上のレスと座標を取得
          let rc = this.resE.first;
          let rcY: number;
          if (rc && rc.elementRef) {
            rcY = rc.elementRef.nativeElement.getBoundingClientRect().top as number;
          }

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

          if (rc && rc.elementRef) {
            setTimeout(() => {
              document.body.scrollTop += rc.elementRef.nativeElement.getBoundingClientRect().top - rcY
            }, 0);
          }
        });
      }
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  async readOld() {
    let ud=this.user.ud.getValue();
    if (this.isReadAllOld) {
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
        });
      }
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open("レス取得に失敗");
    }
  }

  async favo() {
    let ud=this.user.ud.getValue();
    let storage = ud.storage;
    let tf = storage.topicFavo;
    storage.topicFavo = this.isFavo ? tf.delete(this.topic.id) : tf.add(this.topic.id);
    this.user.ud.next(ud);
  }

  get isFavo():boolean{
    return this.user.ud.getValue().storage.topicFavo.has(this.topic.id)
  }
}