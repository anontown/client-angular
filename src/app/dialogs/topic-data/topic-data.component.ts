import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  Topic,
  History,
  AtApiService
} from 'anontown';
import {
  UserService
} from '../../services';
import * as Immutable from 'immutable';

import { MdSnackBar,MdDialogRef } from '@angular/material';

import { Router } from '@angular/router';

@Component({
  templateUrl: './topic-data.component.html',
  styleUrls: ['./topic-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TopicDataDialogComponent implements OnInit, OnDestroy {
  topic: Topic;

  histories: Immutable.List<History>;
  constructor(public user: UserService,
    private api: AtApiService,
    public snackBar: MdSnackBar,
    private router:Router,
    private dialogRef:MdDialogRef<TopicDataDialogComponent>) {
  }

  async ngOnInit() {
    try {
      this.histories = Immutable.List(await this.api.findHistoryAll({ topic: this.topic.id }));
    } catch (_e) {
      this.snackBar.open("編集履歴取得に失敗");
    }
  }

  ngOnDestroy() {
  }

  edit() {
    this.dialogRef.close();
    this.router.navigate(['/topic', this.topic.id, 'edit']);
  }
}