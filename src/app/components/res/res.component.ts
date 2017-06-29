import {
  Component,
  Input,
  ElementRef,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';

import * as Immutable from 'immutable';

import {
  UserService,
  AtApiService,
  IProfileAPI,
  IResAPI,
  IHistoryAPI,
  ITopicAPI
} from '../../services';

import { MdDialog } from '@angular/material';

import { ProfileDialogComponent, ButtonDialogComponent } from '../../dialogs';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./res.component.scss']
})
export class ResComponent implements OnInit, OnDestroy {
  topicRes: null | ITopicAPI = null;
  historyRes: null | IHistoryAPI = null;

  @Input()
  res: IResAPI<IProfileAPI>;

  children = Immutable.List<IResAPI<IProfileAPI>>();

  isReply = false;

  @Input()
  isPop = false;

  @Output()
  update = new EventEmitter<IResAPI<IProfileAPI>>();

  childrenMsg: string | null = null;

  isSelf: boolean;

  constructor(public user: UserService,
    private api: AtApiService,
    private dialog: MdDialog,
    public elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    public snackBar: MdSnackBar) {
  }

  private subscription: Subscription;

  async ngOnInit() {
    this.subscription = this.user.ud.subscribe((ud) => {
      if (ud !== null) {
        this.isSelf = ud.token.user === this.res.user;
      } else {
        this.isSelf = false;
      }
      this.cdr.markForCheck();
    });

    if (this.res.type === 'topic') {
      this.topicRes = await this.api.findTopicOne({ id: this.res.topic });
      this.cdr.markForCheck();
    }

    if (this.res.type === 'history') {
      this.historyRes = await this.api.findHistoryOne({ id: this.res.history });
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  childrenUpdate(res: IResAPI<IProfileAPI>) {
    this.children = this.children.set(this.children.findIndex(r => r!.id === res.id), res);
    this.cdr.markForCheck();
  }

  async hashClick() {
    let ud = this.user.ud.getValue();
    try {
      if (this.children.size !== 0) {
        this.children = Immutable.List<IResAPI<IProfileAPI>>();
        this.childrenMsg = null;
      } else {
        this.children = Immutable.List(await this.api.resesSetProfile(await this.api.findResHash(ud !== null ? ud.auth : null, {
          topic: this.res.topic,
          hash: this.res.hash
        }), ud !== null ? ud.auth : null));
        this.childrenMsg = '抽出 HASH:' + this.res.hash;
      }
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open('レス取得に失敗');
    }
  }

  async sendReplyClick() {
    if (this.res.type !== 'normal') {
      return;
    }

    let ud = this.user.ud.getValue();
    try {
      if (this.children.size !== 0) {
        this.children = Immutable.List<IResAPI<IProfileAPI>>();
      } else {
        this.children = Immutable.List([await this.api.resSetProfile(await this.api.findResOne(ud !== null ? ud.auth : null, {
          id: this.res.reply as string
        }), ud !== null ? ud.auth : null)]);
      }
      this.childrenMsg = null;
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open('レス取得に失敗');
    }
  }

  async receiveReplyClick() {
    let ud = this.user.ud.getValue();
    try {
      if (this.children.size !== 0) {
        this.children = Immutable.List<IResAPI<IProfileAPI>>();
      } else {
        this.children = Immutable.List(await this.api.resesSetProfile(await this.api.findResReply(ud !== null ? ud.auth : null, {
          topic: this.res.topic,
          reply: this.res.id
        }), ud !== null ? ud.auth : null));
      }
      this.childrenMsg = null;
      this.cdr.markForCheck();
    } catch (_e) {
      this.snackBar.open('レス取得に失敗');
    }
  }

  async uv() {
    let ud = this.user.ud.getValue()!;
    try {
      switch (this.res.voteFlag) {
        case 'uv':
          this.update.emit(await this.api.resSetProfile(await this.api.cvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
        case 'dv':
          await this.api.cvRes(ud.auth, {
            id: this.res.id
          });
          this.update.emit(await this.api.resSetProfile(await this.api.uvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
        case 'not':
          this.update.emit(await this.api.resSetProfile(await this.api.uvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
      }
    } catch (_e) {
      this.snackBar.open('投票に失敗');
    }
  }

  async dv() {
    let ud = this.user.ud.getValue()!;
    try {
      switch (this.res.voteFlag) {
        case 'dv':
          this.update.emit(await this.api.resSetProfile(await this.api.cvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
        case 'uv':
          await this.api.cvRes(ud.auth, {
            id: this.res.id
          });

          this.update.emit(await this.api.resSetProfile(await await this.api.dvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
        case 'not':
          this.update.emit(await this.api.resSetProfile(await this.api.dvRes(ud.auth, {
            id: this.res.id
          }), ud.auth));
          break;
      }
    } catch (_e) {
      this.snackBar.open('レス取得に失敗');
    }
  }

  async del() {
    let ud = this.user.ud.getValue()!;
    try {
      let dialogRef = this.dialog.open(ButtonDialogComponent);
      let com = dialogRef.componentInstance;
      com.message = '削除して良いですか？';
      com.actions = [{ data: true, text: 'はい' }, { data: false, text: 'いいえ' }];

      let result: boolean = await dialogRef.afterClosed().toPromise();

      if (result) {
        this.update.emit(await this.api.resSetProfile(await this.api.delRes(ud.auth, {
          id: this.res.id
        }), ud.auth));
      }
    } catch (_e) {
      this.snackBar.open('レス削除に失敗');
    }
  }


  async profileOpen() {
    if (this.res.type !== 'normal') {
      return;
    }

    let ud = this.user.ud.getValue();
    try {
      this.dialog.open(ProfileDialogComponent).componentInstance.profile = await this.api.findProfileOne(ud ? ud.auth : null, {
        id: this.res.profile.id
      });
    } catch (_e) {
      this.snackBar.open('プロフ取得に失敗');
    }
  }
}