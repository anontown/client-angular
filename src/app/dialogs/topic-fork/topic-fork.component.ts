import { Component, OnInit } from '@angular/core';
import { TopicNormal, TopicFork, AtApiService, AtError, IAtError } from 'anontown';
import { UserService } from '../../services/user.service';

import { MdDialogRef, MdSnackBar } from '@angular/material';
import * as Immutable from 'immutable';

@Component({
  templateUrl: './topic-fork.component.html',
  styleUrls: ['./topic-fork.component.scss']
})
export class TopicForkDialogComponent implements OnInit {
  topic: TopicNormal;
  children: Immutable.List<TopicFork>;
  title = "";
  errors: IAtError[] = [];
  constructor(public user: UserService,
    private api: AtApiService,
    private dialogRef: MdDialogRef<TopicForkDialogComponent>,
    private snackBar: MdSnackBar) { }

  async ngOnInit() {
    try {
      this.children = Immutable.List(await this.api.findTopicFork({
        parent: this.topic.id,
        skip: 0,
        limit: 100,
        activeOnly: false
      }));
    } catch (_e) {
      this.snackBar.open("トピック取得に失敗");
    }
  }

  async write() {
    try {
      let topic = await this.api.createTopicFork(this.user.ud.getValue().auth, {
        title: this.title,
        parent: this.topic.id
      });

      this.errors = [];
      this.dialogRef.close(topic.id);
    } catch (e) {
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }
  }
}