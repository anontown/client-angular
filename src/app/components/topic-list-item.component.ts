import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Topic } from 'anontown';
import { UserService, IUserDataListener, IUserData } from '../services';

@Component({
  selector: 'at-topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss']
})
export class TopicListItemComponent implements OnInit, OnDestroy {
  @Input()
  topic: Topic;

  constructor(private user: UserService) {

  }

  ud: IUserData = null;
  private udListener: IUserDataListener;
  newRes: number;

  ngOnInit() {
    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
      if (ud && ud.storage.topicRead.has(this.topic.id)) {
        this.newRes = this.topic.resCount - ud.storage.topicRead.get(this.topic.id).count;
      } else {
        this.newRes = null;
      }
    });
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }
}