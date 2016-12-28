import {
  Component,
  Input,
  ElementRef,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {
  AtApiService,
  Profile,
  Res
} from 'anontown';

import { UserDataService } from '../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'at-res',
  templateUrl: './res-write.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./res.component.scss']
})
export class ResComponent implements OnInit {
  @Input()
  public res: Res;
  private children: Res[] = [];

  @Input()
  isPop: boolean = false;

  @Output()
  update = new EventEmitter<Res>();

  private isSelf: boolean;

  constructor(private ud: UserDataService,
    private api: AtApiService,
    private modal: NgbModal,
    public elementRef: ElementRef,
    private cd: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.isSelf = (await this.ud.isToken) && (await this.ud.token).user === this.res.user;
    this.cd.markForCheck();
  }

  childrenUpdate(res: Res) {
    this.children[this.children.findIndex((r) => r.id === res.id)] = res;
    this.cd.markForCheck();
  }


  private isReply = false;
  reply() {
    this.isReply = !this.isReply;
    this.cd.markForCheck();
  }

  async hashClick() {
    if (this.children.length !== 0) {
      this.children = [];
    } else {
      this.children = await this.api.findResHash(await this.ud.authOrNull, {
        topic: this.res.topic,
        hash: this.res.hash
      });
    }
    this.cd.markForCheck();
  }

  async sendReplyClick() {
    if (this.children.length !== 0) {
      this.children = [];
    } else {
      this.children = [await this.api.findResOne(await this.ud.authOrNull, {
        id: this.res.reply as string
      })];
    }
    this.cd.markForCheck();
  }

  async receiveReplyClick() {
    if (this.children.length !== 0) {
      this.children = [];
    } else {
      this.children = await this.api.findResReply(await this.ud.authOrNull, {
        topic: this.res.topic,
        reply: this.res.id
      });
    }
    this.cd.markForCheck();
  }

  async uv() {
    this.update.emit(await this.api.uvRes(await this.ud.auth, {
      id: this.res.id
    }));
  }

  async dv() {
    this.update.emit(await this.api.dvRes(await this.ud.auth, {
      id: this.res.id
    }));
  }

  async del() {
    this.update.emit(await this.api.delRes(await this.ud.auth, {
      id: this.res.id
    }));
  }

  write() {
    this.isReply = false;
    this.cd.markForCheck();
  }

  //モーダル
  profile: Profile | null = null;

  async profileOpen(profileModal: any) {
    this.profile = await this.api.findProfileOne(await this.ud.authOrNull, {
      id: this.res.profile as string
    });
    this.cd.markForCheck();
    await this.modal.open(profileModal, {
      backdrop: "static",
      keyboard: false
    }).result;
    //クローズ時の処理があるなら以下に書く
  }
}