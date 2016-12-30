import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  Topic
} from 'anontown';
import { UserDataService } from '../services';


@Component({
  selector: 'at-topic-data',
  templateUrl:'./topic-data.component.html'
})
export class TopicDataComponent {
  @Input()
  topic: Topic;

  @Output()
  update = new EventEmitter<Topic>();

  private ud: UserDataService;
  constructor(ud: UserDataService) {
    this.ud = ud;
  }

  private isEdit = false;
  edit() {
    this.isEdit = !this.isEdit;
  }
}