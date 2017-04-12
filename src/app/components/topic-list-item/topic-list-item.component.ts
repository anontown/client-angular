import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { UserService,ITopicAPI } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topic-list-item',
  templateUrl: './topic-list-item.component.html',
  styleUrls: ['./topic-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopicListItemComponent implements OnInit, OnDestroy {
  @Input()
  topic: ITopicAPI;

  @Input()
  simple=false;

  constructor(public user: UserService,
    private cdr: ChangeDetectorRef) {

  }

  private subscription: Subscription;
  newRes: number;

  ngOnInit() {
    this.subscription = this.user.ud.subscribe((ud) => {
      if (ud && ud.storage.topicRead.has(this.topic.id)) {
        this.newRes = this.topic.resCount - ud.storage.topicRead.get(this.topic.id).count;
      } else {
        this.newRes = null;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}