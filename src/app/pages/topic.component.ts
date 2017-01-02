import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  NgZone,
  AfterViewChecked,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as socketio from 'socket.io-client';
import { MdDialog } from '@angular/material';
import {
  Topic,
  AtApiService,
  Res,
} from 'anontown';
import { Config } from '../config';
import { UserService, IUserData, IUserDataListener } from '../services';
import {
  TopicDataComponent,
  TopicAutoScrollMenuComponent,
  ResWriteComponent
} from '../dialogs';
import { ActivatedRoute, Params } from '@angular/router';
import { ResComponent } from '../components/res.component';
import * as Immutable from 'immutable';

@Component({
  selector: 'at-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicComponent implements OnInit, OnDestroy, AfterViewChecked {
  topic: Topic;

  @ViewChildren('resE') resE: QueryList<ResComponent>;

  private reses = Immutable.List<Res>();
  private limit = 50;

  constructor(
    private user: UserService,
    private api: AtApiService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private dialog: MdDialog) {
  }

  private intervalID: any;

  //他のレスを取得している間はロック
  private isLock = false;
  private async lock(call: () => Promise<void>) {
    if (this.isLock) {
      return;
    }
    this.isLock = true;
    await call()
      .catch(e => {
        this.isLock = false;
        throw e;
      });
    //レス数が変わっているはずなので更新
    this.topic = await this.api.findTopicOne({ id: this.topic.id });
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
    let dialog = this.dialog.open(TopicAutoScrollMenuComponent);
    let con = dialog.componentInstance;
    con.autoScrollSpeed = this.autoScrollSpeed;
    con.isAutoScroll = this.isAutoScroll;
    await dialog.afterClosed().toPromise();
    this.autoScrollSpeed = con.autoScrollSpeed;
    this.isAutoScroll = con.isAutoScroll;
  }

  writeMenu() {
    let dialog = this.dialog.open(ResWriteComponent);
    let com = dialog.componentInstance;
    com.topic = this.topic;
    com.reply = null;
    com.write.subscribe(() => {
      dialog.close();
    })
  }

  detail() {
    let com = this.dialog.open(TopicDataComponent).componentInstance;
    com.topic = this.topic;
    com.update.subscribe((topic: Topic) => {
      this.topic = topic;
      com.topic = topic;
    });
  }


  private socket: SocketIOClient.Socket;
  private scrollObs: Subscription;

  //次のビュー更新で最新レスを読み込むか
  private isReadNew = false;
  ngAfterViewChecked() {
    if (this.isReadNew) {
      this.readNew();
      this.isReadNew = false;
    }
  }

  ud: IUserData;
  private udListener: IUserDataListener;

  ngOnDestroy() {
    clearInterval(this.intervalID);
    this.socket.close();
    this.scrollObs.unsubscribe();
    this.user.removeUserDataListener(this.udListener);
  }

  async ngOnInit() {
    let id: string = "";
    this.route.params.forEach((params: Params) => {
      id = params["id"];
    });
    this.topic = await this.api.findTopicOne({ id });

    this.udListener = this.user.addUserDataListener(async (ud, isChange) => {
      this.ud = ud;
      if (ud !== null && ud.storage.topicRead.has(this.topic.id)) {
        //読んだことあるなら続きから
        await this.lock(async () => {
          this.reses = Immutable.List(await this.api.findRes(ud.auth,
            {
              topic: this.topic.id,
              type: "before",
              equal: true,
              date: (await this.api.findResOne(ud.auth, { id: (ud.storage.topicRead.get(this.topic.id).res) })).date,
              limit: this.limit
            }));
        });
        this.isReadNew = true;
      } else {
        //読んだことないなら最新レス
        await this.findNew();
      }

      if (ud !== null && isChange) {
        await this.scroll();
      }
    });

    this.zone.runOutsideAngular(() => {
      this.intervalID = setInterval(() => {
        if (this.isAutoScroll) {
          document.body.scrollTop -= this.autoScrollSpeed;
        }
      }, 200);

      this.scrollObs = Observable.fromEvent(document, "scroll")
        .throttleTime(300)
        .subscribe(() => {
          this.scroll();
        });
    });



    //自動更新
    this.socket = socketio.connect(Config.serverURL, { forceNew: true });
    this.socket.emit("topic-join", this.topic.id);
    this.socket.on("topic", (msg: string) => {
      if (msg === this.topic.id) {
        this.readNew();
      }
    });
  }

  private async findNew() {
    await this.lock(async () => {
      this.reses = Immutable.List(await this.api.findResNew(this.ud ? this.ud.auth : null,
        {
          topic: this.topic.id,
          limit: this.limit
        }));
    });
  }

  async readNew() {
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

        this.reses = Immutable.List((await this.api.findRes(this.ud ? this.ud.auth : null,
          {
            topic: this.topic.id,
            type: "after",
            equal: false,
            date: this.reses.first().date,
            limit: this.limit
          }
        )).concat(this.reses.toArray()));

        if (rc && rc.elementRef) {
          setTimeout(() => {
            document.body.scrollTop += rc.elementRef.nativeElement.getBoundingClientRect().top - rcY
          }, 0);
        }
      });
    }
  }

  async readOld() {
    if (this.reses.size === 0) {
      this.findNew();
    } else {
      await this.lock(async () => {
        this.reses = Immutable.List(this.reses.toArray().concat(await this.api.findRes(this.ud ? this.ud.auth : null,
          {
            topic: this.topic.id,
            type: "before",
            equal: false,
            date: this.reses.last().date,
            limit: this.limit
          }
        )));
      });
    }
  }

  favo() {
    let tf = this.ud.storage.topicFavo;
    let favo = tf.has(this.topic.id) ? tf.delete(this.topic.id) : tf.add(this.topic.id);

    this.user.setUserData({
      auth: this.ud.auth,
      token: this.ud.token,
      profiles: this.ud.profiles,
      storage: this.ud.storage.setFavo(favo)
    });
  }

  async scroll() {
    if (this.ud) {
      //最短距離のレスID
      var res: Res;
      {
        let getTop = (rc: ResComponent) => rc.elementRef.nativeElement.getBoundingClientRect().top as number;
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
      this.user.setUserData({
        auth: this.ud.auth,
        token: this.ud.token,
        profiles: this.ud.profiles,
        storage: this.ud.storage.setTopicRead(this.topic.id, res.id, this.topic.resCount)
      });
    }
  }
}