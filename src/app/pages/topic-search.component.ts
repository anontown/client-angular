import { Component, OnInit } from '@angular/core';
import {
  Topic,
  AtApiService
} from 'anontown';

import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService, Storage } from '../services';

@Component({
  selector: 'at-topic-search',
  templateUrl: './topic-search.component.html'
})
export class TopicSearchComponent implements OnInit {
  private topics: Topic[] = [];

  private category = "";
  private title = "";
  private page = 0;
  private limit = 100;
  //最後の取得件数
  private count = 0;


  constructor(private api: AtApiService,
    private route: ActivatedRoute,
    private router: Router,
    public ud: UserDataService) {

  }

  search() {
    this.page = 0;
    this.router.navigate(["/topic/search"], { queryParams: { title: this.title, category: this.category } });
  }

  update() {
    this.topics = [];
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
    this.topics = this.topics.concat(t);
    this.page++;
  }
  getNewRes(topic: Topic): number {
    if (this.storage) {
      let topicRead = this.storage.topicRead.find(x => x.topic.id === topic.id);
      if (topicRead !== undefined) {
        return topic.resCount - topicRead.count;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  private storage: Storage;

  async ngOnInit() {
    this.route.queryParams.forEach((params) => {
      this.title = params["title"];
      this.category = params["category"];
      this.topics = [];
      this.page = 0;
      this.count = 0;
      this.more();
    });
    if (await this.ud.isToken) {
      this.storage = await this.ud.storage;
    } else {
      this.storage = null;
    }
  }

  linkClick(topic: Topic) {
    this.router.navigate(["/topic", topic.id]);
  }
}