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
  UserService,
  BoardService
} from '../../services';

@Component({
  selector: 'app-topic-search',
  templateUrl: './topic-search.component.html',
  styleUrls: ['./topic-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicSearchComponent implements OnInit, OnDestroy {
  private topics = Immutable.List<Topic>();
  private board: Topic = null;
  private category = '';
  private title = '';
  private page = 0;
  private limit = 100;
  // 最後の取得件数
  private count = 0;
  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private bs: BoardService) {

  }

  search() {
    this.page = 0;
    this.router.navigate(['/topic/search'], { queryParams: { title: this.title, category: this.category } });
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
      category: this.category.length === 0 ? [] : this.category.split('/'),
      skip: this.page * this.limit,
      limit: this.limit
    });
    this.count = t.length;
    this.topics = Immutable.List(this.topics.toArray().concat(t));
    this.page++;
  }


  ngOnInit() {
    this.route.queryParams.forEach(async (params) => {
      this.title = params['title'];
      this.category = params['category'];
      this.topics = Immutable.List<Topic>();
      this.page = 0;
      this.count = 0;
      await this.more();

      if (this.bs.topics) {
        let b = this.bs.topics.find(t => t.category.join("/") === this.category);
        if (b) {
          this.board = b;
        } else {
          this.board = null;
        }
      }
    });
  }

  ngOnDestroy() {
  }

  favo() {
    let storage = this.user.ud.storage;
    let bf = storage.boardFavo;
    storage.topicFavo = bf.has(this.category) ? bf.delete(this.category) : bf.add(this.category);
    this.user.updateUserData();
  }
}