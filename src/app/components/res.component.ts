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
  template: `
    <template #profileModel let-c="close">
      <div class="modal-header">
        <button type="button" class="close" aria-label="Close" (click)="c()">
          <span aria-hidden="true">&times;</span>
        </button>
      <h4 class="modal-title">プロフィール</h4>
      </div>
      <div class="modal-body">
        <at-profile *ngIf="profile!==null" [profile]="profile"></at-profile>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="c()">Close</button>
      </div>
    </template>

    <div [ngClass]="{res:true,'res-self':isSelf}" style="margin:5px 0;">
      <div>
        <a (click)="reply()" href="javascript:void(0);">{{res.name}}</a>
        <a *ngIf="res.profile!==null" (click)="profileOpen(profileModel)" href="javascript:void(0);">[プロフィール]</a>
        <span>{{res.date|date:"y/MM/dd(EEE) HH:mm:ss"}}</span>
        <a href="javascript:void(0);" (click)="hashClick()">HASH:{{res.hash}}</a>
      </div>
      <button *ngIf="res.reply!==null" type="button" (click)="sendReplyClick()" class="res-button">
          <span class="glyphicon glyphicon-send"></span>
      </button>
      <button type="button" (click)="receiveReplyClick()" *ngIf="res.replyCount!==0" class="res-button">
          <span class="glyphicon glyphicon-arrow-right"></span>
          {{res.replyCount}}
      </button>
      <div [innerHTML]="res.mdtext"></div>
      <div class="res-footer">
        <span *ngIf="!isSelf&&(ud.isToken|async)&&!res.isVote">
          <button type="button" (click)="uv()" class="res-button">
            <span class="glyphicon glyphicon-thumbs-up"></span>
          </button>
          <span style="padding:0px 4px;"> {{res.vote}}</span>
          <button type="button" (click)="dv()" class="res-button">
            <span class="glyphicon glyphicon-thumbs-down"></span>
          </button>
        </span>
        <span *ngIf="isSelf||!(ud.isToken|async)||res.isVote">
          <span class="glyphicon glyphicon-hand-right" style="padding-right:4px;"></span>{{res.vote}}
        </span>
        <button type="button" *ngIf="isSelf&&res.deleteFlag==='active'" (click)="del()" class="res-button">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </div>
      <at-res-write *ngIf="isReply&&(ud.isToken|async)" [topic]="res.topic" [reply]="res" (write)="write()"></at-res-write>
      <div *ngIf="children.length!==0">
        <at-res *ngFor="let c of children" [res]="c" (update)="childrenUpdate($event)"></at-res>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .res{
      border:solid 1px #cccccc;
      border-radius: 5px;
      padding:3px;
    }

    .res-self{
      background-color: #dcffdc;
    }

    .res-footer{
      color: #888888;
      font-size:6px;
    }

    .res-button{
      border:solid 1px #999999;
      border-radius: 2px;
      background-color:#ffffff;
    }
  `]
})
export class ResComponent implements OnInit {
  @Input()
  public res: Res;
  private children: Res[] = [];

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