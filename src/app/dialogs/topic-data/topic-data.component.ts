import {
  Component,
  Input,
  Output,
  EventEmitter,
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
  UserService,
  IUserData,
  IUserDataListener
} from '../../services';
import * as Immutable from 'immutable';

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

  histories: Immutable.List<History>;

  ud: IUserData;
  private udListener: IUserDataListener;
  constructor(private user: UserService, private api: AtApiService) {
  }

  async ngOnInit() {
    this.histories = Immutable.List(await this.api.findHistoryAll({ topic: this.topic.id }));

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