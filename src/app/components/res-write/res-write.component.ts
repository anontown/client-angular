import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgZone,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  AtApiService,
  Res,
  Topic,
  AtError,
  IAtError
} from 'anontown';

import { UserService } from '../../services';


@Component({
  selector: 'app-res-write',
  templateUrl: './res-write.component.html',
  styleUrls: ['./res-write.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ResWriteComponent implements OnInit, OnDestroy {
  private name = "";
  private text = "";
  private profile: string | null = null;
  private errors: IAtError[]=[];
  private age = true;
  @Output()
  write = new EventEmitter<Res>();

  markdown = true;


  ngOnInit() {
  }

  ngOnDestroy() {
  }

  constructor(public user: UserService,
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
  reply: Res | string | null = null;

  async ok() {
    let ud=this.user.ud.getValue();
    try {
      let text: string;
      if (this.text.length !== 0 && !this.markdown) {
        text = this.text.split(/\r\n|\r|\n/).map(s => "    " + s).join("\n");
      } else {
        text = this.text;
      }
      let res = await this.api.createRes(ud.auth, {
        topic: typeof this.topic === "string" ? this.topic : this.topic.id,
        name: this.name,
        text: text,
        reply: this.reply === null ? null
          : typeof this.reply === "string" ? this.reply
            : this.reply.id,
        profile: this.profile,
        age: this.age
      });

      this.text = "";
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