import { Component,
   Input,
    Output, 
    EventEmitter, 
    OnDestroy, 
    OnInit ,
  ChangeDetectionStrategy} from '@angular/core';
import {
  Topic
} from 'anontown';
import { UserService, 
  IUserData,
   IUserDataListener
   } from '../services';


@Component({
  selector: 'app-topic-data',
  templateUrl: './topic-data.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicDataComponent implements OnInit, OnDestroy {
  @Input()
  topic: Topic;

  @Output()
  update = new EventEmitter<Topic>();

  ud: IUserData;
  private udListener: IUserDataListener;
  constructor(private user: UserService) {
  }

  ngOnInit() {
    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
    });
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }

  private isEdit = false;
  edit() {
    this.isEdit = !this.isEdit;
  }
}