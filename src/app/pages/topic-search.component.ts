import { Component, OnInit } from '@angular/core';
import {
  Topic,
  AtApiService
} from 'anontown';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'at-topic-search',
  template: `
    <div class="container">
      <form (ngSubmit)="search()">
        <div class="form-group">
          <label>カテゴリ</label>
          <input type="text" class="form-control" [(ngModel)]="category" name="category">
        </div>
        <div class="form-group">
          <label>スレタイ</label>
          <input type="text" class="form-control" [(ngModel)]="title" name="title">
        </div>
        <button type="submit" class="btn btn-default">検索</button>
      </form>
      <hr>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>作成</th>
            <th>更新</th>
            <th>カテゴリ</th>
          <tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of topics" (click)="linkClick(t)" style="cursor: pointer;">
            <td>{{t.title}}</td>
            <td>{{t.date|date:"y/MM/dd(EEE) HH:mm:ss"}}</td>
            <td>{{t.update|date:"y/MM/dd(EEE) HH:mm:ss"}}</td>
            <td>{{t.category}}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" *ngIf="count===limit" (click)="more()">もっと</button>
    </div>
  `,
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