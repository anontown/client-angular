import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  UserService,
  ITopicAPI,
  IHistoryAPI,
  AtApiService
} from '../../services';
import * as Immutable from 'immutable';

import { MdSnackBar } from '@angular/material';

@Component({
  templateUrl: './topic-data.component.html',
  styleUrls: ['./topic-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicDataDialogComponent implements OnInit, OnDestroy {
  topic: ITopicAPI;
  parent:ITopicAPI;

  histories: Immutable.List<IHistoryAPI>;
  constructor(public user: UserService,
    private api: AtApiService,
    public snackBar: MdSnackBar) {
  }

  async ngOnInit() {
    if (this.topic.type === 'normal') {
      try {
        this.histories = Immutable.List(await this.api.findHistoryAll({ topic: this.topic.id }));
      } catch (_e) {
        this.snackBar.open('編集履歴取得に失敗');
      }
    }else if(this.topic.type==='fork'){
      try {
        this.parent = await this.api.findTopicOne({ id: this.topic.parent });
      } catch (_e) {
        this.snackBar.open('親トピック取得に失敗');
      }
    }
  }

  ngOnDestroy() {
  }
}