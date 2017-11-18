import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  UserService,
  AtApiService,
  IResAPI,
  ITopicAPI,
  AtError,
  IAtError,
  IProfileAPI
} from '../../services';


@Component({
  selector: 'app-res-write',
  templateUrl: './res-write.component.html',
  styleUrls: ['./res-write.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResWriteComponent implements OnInit, OnDestroy {
  name = '';
  text = '';
  profile: string | null = null;
  errors: IAtError[] = [];
  age = true;
  @Output()
  write = new EventEmitter<IResAPI>();


  async ngOnInit() {
    let ud = await this.user.ud.first().toPromise();
    this.profiles = await this.api.findProfileAll(ud.auth);
  }

  ngOnDestroy() {
  }

  constructor(public user: UserService,
    private api: AtApiService) {
  }



  key(e: any) {
    if (e.shiftKey && e.keyCode === 13) {
      this.ok();
    }
  }

  @Input()
  topic: ITopicAPI | string;

  @Input()
  reply: IResAPI | string | null = null;

  profiles: IProfileAPI[];

  async ok() {
    let ud = this.user.ud.getValue()!;
    try {
      let res = await this.api.createRes(ud.auth, {
        topic: typeof this.topic === 'string' ? this.topic : this.topic.id,
        name: this.name.length !== 0 ? this.name : null,
        text: this.text,
        reply: this.reply !== null
          ? typeof this.reply === 'string'
            ? this.reply
            : this.reply.id
          : null,
        profile: this.profile,
        age: this.age
      });

      this.text = '';
      this.reply = null;
      this.errors = [];
      this.write.emit(res);
    } catch (e) {
      if (e instanceof AtError) {
        this.errors = e.errors;
      } else {
        throw e;
      }
    }
  }
}