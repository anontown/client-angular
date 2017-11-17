import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  UserService,
  AtApiService,
  AtError,
  TopicType,
  IAtError
} from '../../services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ButtonDialogComponent } from '../../dialogs';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './topic-create.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-page-topic-create'
})
export class TopicCreatePageComponent implements OnInit, OnDestroy {
  title = '';
  tags = '';
  text = '';
  type: TopicType = 'one';
  errors: IAtError[] = [];

  constructor(public user: UserService,
    private api: AtApiService,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('トピック作成');
  }

  ngOnDestroy() {
  }

  async write() {
    if (this.type === 'normal') {
      let dialog = this.dialog.open(ButtonDialogComponent);
      dialog.componentInstance.actions = [
        { data: true, text: 'はい' },
        { data: false, text: 'いいえ' }
      ];
      dialog.componentInstance.message = 'ニュース・ネタ・実況などは単発トピックで建てて下さい。\n本当に建てますか？';
      if (!(await dialog.afterClosed().toPromise())) {
        return;
      }
    }

    let ud = this.user.ud.getValue()!;
    try {
      let params = {
        title: this.title,
        tags: this.tags.length === 0 ? [] : this.tags.split(/[\s　\,]+/),
        text: this.text,
      };
      let topic = this.type === 'one' ?
        await this.api.createTopicOne(ud.auth, params) :
        await this.api.createTopicNormal(ud.auth, params);

      this.errors = [];
      this.router.navigate(['topic', topic.id]);
    } catch (e) {
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }
  }
}