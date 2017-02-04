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

import * as Immutable from 'immutable';


import {
  AtApiService,
  Res,
} from 'anontown';


import { UserService, IUserDataListener } from '../../services';
import { MdDialog } from '@angular/material';

import { ProfileDialogComponent, ResWriteDialogComponent, ButtonDialogComponent } from '../../dialogs';
import {MdSnackBar} from '@angular/material';

import { Router } from '@angular/router';

@Component({
  selector: 'app-res',
  templateUrl: './res.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./res.component.scss']
})
export class ResComponent implements OnInit, OnDestroy {
  @Input()
  res: Res;

  children = Immutable.List<Res>();

  @Input()
  isPop: boolean = false;

  @Output()
  update = new EventEmitter<Res>();

  childrenMsg: string = null;

  isSelf: boolean;

  constructor(private user: UserService,
    private api: AtApiService,
    private dialog: MdDialog,
    public elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    public snackBar: MdSnackBar,
    private router:Router) {
  }

  private udListener: IUserDataListener;

  private isIOS=navigator.userAgent.match(/iPhone|iPad/);


  ngOnInit() {
    this.udListener = this.user.addUserDataListener(() => {
      let ud = this.user.ud;
      if (ud !== null) {
        this.isSelf = ud.token.user === this.res.user;
      } else {
        this.isSelf = false;
      }
      this.cdr.markForCheck();
    });

  }

  ngOnDestroy() {
    this.user.removeUserDataListener(this.udListener);
  }

  childrenUpdate(res: Res) {
    this.children = this.children.set(this.children.findIndex((r) => r.id === res.id), res);
    this.cdr.markForCheck();
  }


  reply() {
    if(!this.isIOS){
      let dialog = this.dialog.open(ResWriteDialogComponent);
      let com = dialog.componentInstance;
      com.topic = this.res.topic;
      com.reply = this.res;
    }else{
      this.router.navigate(['topic',this.res.topic,'write'], { queryParams: { reply:this.res.id } });
    }
  }

  async hashClick() {
    try{
      if (this.children.size !== 0) {
        this.children = Immutable.List<Res>();
        this.childrenMsg = null;
      } else {
        this.children = Immutable.List(await this.api.findResHash(this.user.ud !== null ? this.user.ud.auth : null, {
          topic: this.res.topic,
          hash: this.res.hash
        }));
        this.childrenMsg = "抽出 HASH:" + this.res.hash;
      }
      this.cdr.markForCheck();
    }catch(_e){
      this.snackBar.open("レス取得に失敗");
    }
  }

  async sendReplyClick() {
    try{
      if (this.children.size !== 0) {
        this.children = Immutable.List<Res>();
      } else {
        this.children = Immutable.List([await this.api.findResOne(this.user.ud !== null ? this.user.ud.auth : null, {
          id: this.res.reply as string
        })]);
      }
      this.childrenMsg = null;
      this.cdr.markForCheck();
    }catch(_e){
      this.snackBar.open("レス取得に失敗");
    }
  }

  async receiveReplyClick() {
    try{
      if (this.children.size !== 0) {
        this.children = Immutable.List<Res>();
      } else {
        this.children = Immutable.List(await this.api.findResReply(this.user.ud !== null ? this.user.ud.auth : null, {
          topic: this.res.topic,
          reply: this.res.id
        }));
      }
      this.childrenMsg = null;
      this.cdr.markForCheck();
    }catch(_e){
      this.snackBar.open("レス取得に失敗");
    }
  }

  async uv() {
    try{
      switch (this.res.voteFlag) {
        case "uv":
          this.update.emit(await this.api.cvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
        case "dv":
          await this.api.cvRes(this.user.ud.auth, {
            id: this.res.id
          });
          this.update.emit(await this.api.uvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
        case "not":
          this.update.emit(await this.api.uvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
      }
    }catch(_e){
      this.snackBar.open("投票に失敗");
    }
  }

  async dv() {
    try{
      switch (this.res.voteFlag) {
        case "dv":
          this.update.emit(await this.api.cvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
        case "uv":
          await this.api.cvRes(this.user.ud.auth, {
            id: this.res.id
          });
          this.update.emit(await this.api.dvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
        case "not":
          this.update.emit(await this.api.dvRes(this.user.ud.auth, {
            id: this.res.id
          }));
          break;
      }
    }catch(_e){
      this.snackBar.open("レス取得に失敗");
    }
  }

  async del() {
    try{
      let dialogRef = this.dialog.open(ButtonDialogComponent);
      let com = dialogRef.componentInstance;
      com.message = "削除して良いですか？";
      com.actions = [{ data: true, text: "はい" }, { data: false, text: "いいえ" }];

      let result: boolean = await dialogRef.afterClosed().toPromise();

      if (result) {
        this.update.emit(await this.api.delRes(this.user.ud.auth, {
          id: this.res.id
        }));
      }
    }catch(_e){
      this.snackBar.open("レス削除に失敗");
    }
  }
  

  async profileOpen() {
    try{
      this.dialog.open(ProfileDialogComponent).componentInstance.profile = await this.api.findProfileOne(this.user.ud ? this.user.ud.auth : null, {
        id: this.res.profile as string
      });
    }catch(_e){
      this.snackBar.open("プロフ取得に失敗");
    }
  }
}