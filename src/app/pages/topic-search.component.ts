import { Component, OnInit } from '@angular/core';
import {
  Topic,
  AtApiService
} from 'anontown';

import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router) {

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

  ngOnInit() {
    this.route.queryParams.forEach((params) => {
      this.title = params["title"];
      this.category = params["category"];
      this.topics = [];
      this.page = 0;
      this.count = 0;
      this.more();
    });
  }

  linkClick(topic: Topic) {
    this.router.navigate(["/topic", topic.id]);
  }
}