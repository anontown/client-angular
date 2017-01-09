import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  AtApiService,
  Res,
  Topic,
  AtError
} from 'anontown';

import { UserService, IUserData, IUserDataListener } from '../../services';

@Component({
  selector: 'app-res-write',
  templateUrl: './res-write.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResWriteComponent implements OnInit, OnDestroy {
  private name = "";
  private text = "";
  private profile: string | null = null;
  private errorMsg: string | null = null;
  @Output()
  write = new EventEmitter<Res>();

  ud: IUserData;
  private udListener: IUserDataListener;

  markdown = true;

  ngOnInit() {
    this.udListener = this.user.addUserDataListener(ud => {
      this.ud = ud;
    });
  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }

  constructor(private user: UserService,
    private api: AtApiService,
    private zone: NgZone) {
  }



  key(e: any) {
    this.zone.runOutsideAngular(() => {
      if (e.shiftKey && e.keyCode === 13) {
        this.zone.run(() => {
          this.ok();
        });
      }
    });
  }

  @Input()
  topic: Topic | string;

  @Input()
  reply: Res | null = null;

  ok() {
    (async () => {
      let text: string;
      if (this.text.length !== 0 && !this.markdown) {
        text = this.text.split(/\r\n|\r|\n/).map(s => "    " + s).join("\n");
      } else {
        text = this.text;
      }
      let res = await this.api.createRes(this.ud.auth, {
        topic: typeof this.topic === "string" ? this.topic : this.topic.id,
        name: this.name,
        text: text,
        reply: this.reply !== null ? this.reply.id : null,
        profile: this.profile
      });

      this.text = "";
      this.reply = null;
      this.errorMsg = null;
      this.write.emit(res);
    })().catch(e => {
      if (e instanceof AtError) {
        this.errorMsg = e.message;
      } else {
        throw e;
      }
    });
  }
}