import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material';

import { InfiniteScrollDirective } from '../../directives';
import {
  UserService,
  ITopicAPI,
  AtApiService,
  IResAPI,
  ITopicNormalAPI,
  IProfileAPI
} from '../../services';
import {
  TopicDataDialogComponent,
  TopicEditDialogComponent,
  TopicForkDialogComponent
} from '../../dialogs';
import { ActivatedRoute } from '@angular/router';
import { ResComponent } from '../../components';
import * as Immutable from 'immutable';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-page-topic'
})
export class TopicPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  topic: ITopicAPI;

  @ViewChildren('resE') resE: QueryList<ResComponent>;

  isResWrite = false;

  private limit = 50;

  // 全レス読んだか
  isReadAllNew = false;
  isReadAllOld = false;

  constructor(
    public user: UserService,
    private api: AtApiService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private titleService: Title) {
  }

  updateItem$ = new Subject<IResAPI<IProfileAPI>>();

  findNewItem = async () => {
    let ud = await this.user.ud.first().toPromise();
    return Immutable.List(await this.api.resesSetProfile(await this.api.findResNew(ud ? ud.auth : null, {
      topic: this.topic.id,
      limit: this.limit
    }), ud ? ud.auth : null));
  }

  findItem = async (type: 'after' | 'before', date: string, equal: boolean) => {
    let ud = await this.user.ud.first().toPromise();
    return Immutable.List(await this.api.resesSetProfile(await this.api.findRes(ud ? ud.auth : null, {
      topic: this.topic.id,
      type: type,
      equal: equal,
      date,
      limit: this.limit
    }), ud ? ud.auth : null));
  }

  @ViewChild('autoScrollDialog')
  autoScrollDialog: TemplateRef<any>;
  autoScrollSpeed = 15;
  isAutoScroll = false;
  autoScroll() {
    this.isAutoScroll = !this.isAutoScroll;
  }
  autoScrollMenu() {
    this.dialog.open(this.autoScrollDialog);
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


  updateNew$ = Observable.empty<IResAPI<IProfileAPI>>();

  afterViewChecked = new Subject<void>();
  ngAfterViewChecked() {
    this.afterViewChecked.next();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.storageSave(null);
  }

  scrollNewItem: { id: string, date: string };

  async ngOnInit() {
    let first = true;
    this.route.params.forEach(async (params) => {
      if (!first) {
        this.isReadAllNew = false;
        this.isReadAllOld = false;
        this.ngOnDestroy();
      }
      first = false;

      let id = params['id'];
      try {
        this.topic = await this.api.findTopicOne({ id });
        this.titleService.setTitle(this.topic.title);
      } catch (_e) {
        this.snackBar.open('トピック取得に失敗', "OK", { duration: 5000 });
      }

      let ud = await this.user.ud.first().toPromise();
      if (ud) {
        let topicRead = ud.storage.topicRead.get(this.topic.id);
        if (topicRead) {
          let readRes = await this.api.findResOne(ud.auth, {
            id: topicRead.res
          });

          this.scrollNewItem = {
            id: readRes.id,
            date: readRes.date
          };
        } else {
          this.scrollNewItem = null;
        }
      } else {
        this.scrollNewItem = null;
      }

      this.updateNew$ = this.api.streamUpdateTopic(ud ? ud.auth : null, { id })
        .do(x => {
          this.topic.resCount = x.count;
          this.storageSave(null);
        })
        .flatMap(async x => await this.api.resSetProfile(x.res, ud ? ud.auth : null));
    });
  }

  scrollNewItemChange(item: { id: string, date: string }) {
    if (!item || !this.user.ud.getValue()) {
      return;
    }

    this.storageSave(item.id);
  }

  storageSave(res: string | null) {
    let ud = this.user.ud.getValue();
    if (!ud) {
      return;
    }
    if (res === null) {
      if (ud.storage.topicRead.has(this.topic.id)) {
        res = ud.storage.topicRead.get(this.topic.id).res;
      } else {
        if (this.infiniteScroll.list.size === 0) {
          return;
        }
        res = this.infiniteScroll.list.first().id;
      }
    }
    let storage = ud.storage;
    storage.topicRead = storage.topicRead.set(this.topic.id, {
      res: res,
      count: this.topic.resCount
    });
    this.user.ud.next(ud);
  }

  private subscriptions: Subscription[] = [];

  @ViewChild('infiniteScroll')
  infiniteScroll: InfiniteScrollDirective<IResAPI<IProfileAPI>>;

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


  async favo() {
    let ud = this.user.ud.getValue();
    let storage = ud!.storage;
    let tf = storage.topicFavo;
    storage.topicFavo = this.isFavo ? tf.delete(this.topic.id) : tf.add(this.topic.id);
    this.user.ud.next(ud);
  }

  get isFavo(): boolean {
    return this.user.ud.getValue()!.storage.topicFavo.has(this.topic.id);
  }
}