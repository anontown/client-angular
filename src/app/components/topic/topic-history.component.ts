import { Component, Input } from '@angular/core';
import { AtApiService, Topic, Res, History } from 'anontown';
import { UserDataService } from '../../services';

@Component({
  selector: 'at-topic-history',
  template: ` 
    <div class="panel panel-default">
      <div class="panel-heading">
        <button type="button" class="btn btn-default" (click)="detail()">
          <span [ngClass]="['glyphicon',isDetail?'glyphicon-chevron-up':'glyphicon-chevron-down']"></span>
        </button>
        {{history.date|date:"y/MM/dd(EEE) HH:mm:ss"}} 
        <a href="javascript:void(0);" (click)="hashClick()">HASH:{{history.hash}}</a>
      </div>
      <div class="panel-body">
        <dl *ngIf="isDetail"  class="dl-horizontal">
          <dt>タイトル</dt>
          <dd>{{history.title}}</dd>
          <dt>カテゴリ</dt>
          <dd><a [routerLink]="['/topic/search']" [queryParams]="{title:'',category:history.category}">{{history.category}}</a></dd>
          <dt>本文</dt>
          <dd>
              <div class="panel panel-default">
                  <div [innerHTML]="history.mdtext" class="panel-body"></div>
              </div>
          </dd>
        </dl>
        <div *ngIf="hashReses.length!==0">
          <at-res *ngFor="let r of hashReses" [res]="r" (update)="updateRes($event)"></at-res>
        </div>
      </div>
    </div>
    `
})
export class TopicHistoryComponent {
  @Input()
  private topic: Topic;

  @Input()
  private history: History;

  private hashReses: Res[] = [];

  private isDetail = false;

  detail() {
    this.isDetail = !this.isDetail;
  }

  constructor(private api: AtApiService,
    private ud: UserDataService) {

  }

  updateRes(res: Res) {
    this.hashReses[this.hashReses.findIndex((r) => r.id === res.id)] = res;
  }

  async hashClick() {
    if (this.hashReses.length !== 0) {
      this.hashReses = [];
    } else {
      this.hashReses = (await this.api.findResHash(await this.ud.authOrNull, {
        topic: this.topic.id,
        hash: this.history.hash
      }));

    }
  }
}