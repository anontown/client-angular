import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  Topic,
  AtApiService
} from 'anontown';

import {
  ActivatedRoute,
  Router
} from '@angular/router';
import * as Immutable from 'immutable';
import {
  IUserData,
  IUserDataListener,
  UserService
} from '../../services';

@Component({
  selector: 'app-topic-search',
  templateUrl: './topic-search.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicSearchComponent implements OnInit, OnDestroy {
  private topics = Immutable.List<Topic>();

  private category = "";
  private title = "";
  private page = 0;
  private limit = 100;
  //最後の取得件数
  private count = 0;

  private udListener: IUserDataListener;
  ud: IUserData;
  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService) {

  }

  search() {
    this.page = 0;
    this.router.navigate(["/topic/search"], { queryParams: { title: this.title, category: this.category } });
  }

  update() {
    this.topics = Immutable.List<Topic>();
    this.page = 0;
    this.count = 0;
    this.more();
  }

  async more() {
    let t = await this.api.findTopic({
      title: this.title,
      category: this.category.length === 0 ? [] : this.category.split("/"),
      skip: this.page * this.limit,
      limit: this.limit
    });
    this.count = t.length;
    this.topics = Immutable.List(this.topics.toArray().concat(t));
    this.page++;
  }


  ngOnInit() {
    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
    });

    this.route.queryParams.forEach((params) => {
      this.title = params["title"];
      this.category = params["category"];
      this.topics = Immutable.List<Topic>();
      this.page = 0;
      this.count = 0;
      this.more();
    });
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }

  linkClick(topic: Topic) {
    this.router.navigate(["/topic", topic.id]);
  }
}