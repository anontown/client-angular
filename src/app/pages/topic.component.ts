import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  NgZone
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as socketio from 'socket.io-client';

import {
  Topic,
  AtApiService,
  Res,
} from 'anontown';
import { Config } from '../config';
import { UserDataService } from '../services';

import { ActivatedRoute, Params } from '@angular/router';
import { ResComponent } from '../components/res.component';

@Component({
  selector: 'at-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit, OnDestroy {
  topic: Topic;

  @ViewChildren('resE') resE: QueryList<ResComponent>;

  private reses: Res[] = [];
  private limit = 50;

  private isFavo: boolean;

  topicUpdate(topic: Topic) {
    this.topic = topic;
  }

  constructor(
    private ud: UserDataService,
    private api: AtApiService,
    private route: ActivatedRoute,
    private zone: NgZone) {
  }

  private intervalID: NodeJS.Timer;

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
    this.isLock = false;
  }

  updateRes(res: Res) {
    this.reses[this.reses.findIndex((r) => r.id === res.id)] = res;
  }

  private isAutoScrollMenu = false;
  autoScrollMenu() {
    this.isAutoScrollMenu = !this.isAutoScrollMenu;
    if (this.isAutoScrollMenu) {
      this.isWrite = false;
      this.isDetail = false;
    }
  }

  private isWrite = false;
  writeMenu() {
    this.isWrite = !this.isWrite;
    if (this.isWrite) {
      this.isAutoScrollMenu = false;
      this.isDetail = false;
    }
  }

  private isDetail = false;
  detail() {
    this.isDetail = !this.isDetail;
    if (this.isDetail) {
      this.isAutoScrollMenu = false;
      this.isWrite = false;
    }
  }

  autoScrollSpeed = 10;
  private isAutoScroll = false;
  autoScroll() {
    this.isAutoScroll = !this.isAutoScroll;
  }

  async ngOnDestroy() {
    clearInterval(this.intervalID);
    this.socket.close();
    this.scrollObs.unsubscribe();
  }

  write() {
    this.isWrite = false;
  }


  private socket: SocketIOClient.Socket;
  private scrollObs: Subscription;
  async ngOnInit() {
    if (!this.topic) {
      let id: string = "";
      this.route.params.forEach((params: Params) => {
        id = params["id"];
      });
      this.topic = await this.api.findTopicOne({ id });
    }

    if (await this.ud.isToken) {
      this.isFavo = (await this.ud.storage).isFavo(this.topic);
    }

    if (await this.ud.isToken && (await this.ud.storage).isRead(this.topic)) {
      //読んだことあるなら続きから
      await this.lock(async () => {
        this.reses = await this.api.findRes(await this.ud.authOrNull,
          {
            topic: this.topic.id,
            type: "before",
            equal: true,
            date: ((await this.ud.storage).topicRead.find(x => x.topic.id === this.topic.id) as { res: Res }).res.date,
            limit: this.limit
          });
      });
    } else {
      //読んだことないなら最新レス
      await this.findNew();
    }

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
      this.reses = await this.api.findResNew(await this.ud.authOrNull,
        {
          topic: this.topic.id,
          limit: this.limit
        });
    });
  }

  async readNew() {
    if (this.reses.length === 0) {
      this.findNew();
    } else {
      await this.lock(async () => {
        //一番上のレスと座標を取得
        let rc = this.resE.first;
        let rcY: number;
        if (rc.elementRef) {
          rcY = rc.elementRef.nativeElement.getBoundingClientRect().top as number;
        }

        this.reses = (await this.api.findRes(await this.ud.authOrNull,
          {
            topic: this.topic.id,
            type: "after",
            equal: false,
            date: this.reses[0].date,
            limit: this.limit
          }
        )).concat(this.reses);

        if (rc.elementRef) {
          setTimeout(() => {
            document.body.scrollTop += rc.elementRef.nativeElement.getBoundingClientRect().top - rcY
          }, 0);
        }
      });
    }
  }

  async readOld() {
    if (this.reses.length === 0) {
      this.findNew();
    } else {
      await this.lock(async () => {
        this.reses = this.reses.concat(await this.api.findRes(await this.ud.authOrNull,
          {
            topic: this.topic.id,
            type: "before",
            equal: false,
            date: this.reses[this.reses.length - 1].date,
            limit: this.limit
          }
        ));
      });
    }
  }

  async favo() {
    let storage = await this.ud.storage;
    if (storage.isFavo(this.topic)) {
      //削除
      storage.topicFav = storage.topicFav.filter(x => x.id !== this.topic.id);
    } else {
      storage.topicFav.push(this.topic);
    }
    this.isFavo = storage.isFavo(this.topic);
  }

  async scroll() {
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
    if (await this.ud.isToken) {
      if ((await this.ud.storage).isRead(this.topic)) {
        let val = ((await this.ud.storage).topicRead.find(x => x.topic.id === this.topic.id) as { topic: Topic, res: Res });
        val.res = res;
      } else {
        (await this.ud.storage).topicRead.push({ topic: this.topic, res: res });
      }
    }
  }
}