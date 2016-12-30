import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'anontown';
import { UserDataService } from '../services/user-data';

@Component({
  selector: 'at-topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss']
})
export class TopicListItemComponent implements OnInit {
  @Input()
  topic: Topic;

  constructor(private ud: UserDataService) {

  }

  newRes: number;

  async ngOnInit() {
    if (await this.ud.isToken) {
      let topicRead = (await this.ud.storage).topicRead.find(x => x.topic.id === this.topic.id);
      if (topicRead !== undefined) {
        this.newRes = this.topic.resCount - topicRead.count;
      }
    }
  }
}