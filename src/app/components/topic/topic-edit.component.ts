import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  AtApiService,
  Topic,
  AtError
} from 'anontown';
import { UserDataService } from '../../services';


@Component({
  selector: 'at-topic-edit',
  template: `
    <form (ngSubmit)="ok()">
      <div class="alert alert-danger" *ngIf="errorMsg!==null">
        <span class="glyphicon glyphicon-exclamation-sign"></span>
        {{errorMsg}}
      </div>
      <div class="form-group">
        <label>タイトル</label>
        <input type="text" class="form-control" [(ngModel)]="title" name="title">
      </div>
      <div class="form-group">
        <label>カテゴリ</label>
        <input type="text" class="form-control" [(ngModel)]="category" name="category">
      </div>
      <div class="form-group">
        <label>本文</label>
        <textarea class="form-control" [(ngModel)]="text" name="text"></textarea>
        <div [innerHTML]="text|md" class="well"></div>
      </div>
      <button type="submit" class="btn btn-default">OK</button>
    </form>
  `,
})
export class TopicEditComponent extends OnInit {
  @Input()
  private topic: Topic;

  @Output()
  update = new EventEmitter<Topic>();

  private title = "";
  private category = "";
  private text = "";
  private errorMsg: string | null = null;

  constructor(private ud: UserDataService,
    private api: AtApiService) {
    super();
  }

  ngOnInit() {
    this.title = this.topic.title;
    this.category = this.topic.category.join("/");
    this.text = this.topic.text;
  }

  ok() {
    (async () => {
      let topic = await this.api.updateTopic(await this.ud.auth, {
        id: this.topic.id,
        title: this.title,
        category: this.category.length === 0 ? [] : this.category.split("/"),
        text: this.text
      });
      this.errorMsg = null;
      this.update.emit(topic);
    })().catch(e => {
      if (e instanceof AtError) {
        this.errorMsg = e.message;
      } else {
        throw e;
      }
    });
  }
} 