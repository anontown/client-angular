import { Component, Input } from '@angular/core';
import {
  Topic
} from 'anontown';
import { UserDataService } from '../services';


@Component({
  selector: 'at-topic-data',
  template: `
    <div class="panel panel-default">
      <div class="panel-body">
        <h1>{{topic.title}}</h1>
        <button type="button" class="btn btn-default" (click)="detail()">
          <span [ngClass]="['glyphicon',isDetail?'glyphicon-chevron-up':'glyphicon-chevron-down']"></span>
        </button>
        <div *ngIf="isDetail">
          <dl class="dl-horizontal">
            <dt>作成</dt>
            <dd>{{topic.date|date:"y/MM/dd(EEE) HH:mm:ss"}}</dd>
            <dt>更新</dt>
            <dd>{{topic.update|date:"y/MM/dd(EEE) HH:mm:ss"}}</dd>
            <dt>カテゴリ</dt>
            <dd><a [routerLink]="['/topic/search']" [queryParams]="{title:'',category:topic.category}">{{topic.category}}</a></dd>
            <dt>本文</dt>
            <dd>
              <div class="panel panel-default">
                <div [innerHTML]="topic.mdtext" class="panel-body"></div>
              </div>
            </dd>
            <dt>編集履歴</dt>
            <dd>
              <div class="panel-group">
                <at-topic-history *ngFor="let h of topic.histories" [history]="h" [topic]="topic"></at-topic-history>
              </div>
            </dd>
          </dl>
        </div>
        <button type="button" class="btn btn-default" *ngIf="ud.isToken|async" (click)="edit()">
          <span class="glyphicon glyphicon-edit"></span>
        </button>
        <at-topic-edit *ngIf="isEdit&&(ud.isToken|async)" [topic]="topic"></at-topic-edit>
      </div>
    </div>
  `,
})
export class TopicDataComponent {
  @Input()
  topic: Topic;

  private ud: UserDataService;
  constructor(ud: UserDataService) {
    this.ud = ud;
  }


  //本文を表示するか
  private isDetail = false;
  detail() {
    this.isDetail = !this.isDetail;
  }

  private isEdit = false;
  edit() {
    this.isEdit = !this.isEdit;
  }
}