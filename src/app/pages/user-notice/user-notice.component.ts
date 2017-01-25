import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
    Res,
    AtApiService,
} from 'anontown';
import { UserService, IUserDataListener } from '../../services';
import * as Immutable from 'immutable';
import {MdSnackBar} from '@angular/material';

@Component({
    selector: 'app-user-notice',
    templateUrl: './user-notice.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserNoticeComponent implements OnInit, OnDestroy {
    private reses = Immutable.List<Res>();
    private limit = 50;

    constructor(
        private user: UserService,
        private api: AtApiService,
        public snackBar: MdSnackBar) {
    }

    private udListener: IUserDataListener;
    ngOnInit() {
        document.title="通知"
        let isInit = false;
        this.udListener = this.user.addUserDataListener(() => {
            if (isInit) {
                return;
            }
            isInit = true;
            if (this.user.ud !== null) {
                this.findNew();
            }
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    updateRes(res: Res) {
        this.reses.set(this.reses.findIndex((r) => r.id === res.id), res);
    }

    private async findNew() {
        try{
            this.reses = Immutable.List(await this.api.findResNoticeNew(this.user.ud.auth, {
                limit: this.limit
            }));
        }catch(_e){
            this.snackBar.open("レス取得に失敗");
        }
    }

    async readNew() {
        try{
            if (this.reses.size === 0) {
                this.findNew();
            } else {
                this.reses = Immutable.List((await this.api.findResNotice(this.user.ud.auth,
                    {
                        type: "after",
                        equal: false,
                        date: this.reses.first().date,
                        limit: this.limit
                    })).concat(this.reses.toArray()));
            }
        }catch(_e){
            this.snackBar.open("レス取得に失敗");
        }
    }

    async readOld() {
        try{
            if (this.reses.size === 0) {
                this.findNew();
            } else {
                this.reses = Immutable.List(this.reses.toArray().concat(await this.api.findResNotice(this.user.ud.auth,
                    {
                        type: "before",
                        equal: false,
                        date: this.reses.last().date,
                        limit: this.limit
                    })));
            }
        }catch(_e){
            this.snackBar.open("レス取得に失敗");
        }
    }
}