import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
    Res,
    AtApiService,
} from 'anontown';
import { UserService } from '../../services';
import * as Immutable from 'immutable';
import {MdSnackBar} from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './user-notice.page.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserNoticePageComponent implements OnInit, OnDestroy {
    private reses = Immutable.List<Res>();
    private limit = 50;

    constructor(
        public user: UserService,
        private api: AtApiService,
        public snackBar: MdSnackBar) {
    }

    private subscription: Subscription;
    ngOnInit() {
        document.title="通知"
        let isInit = false;
        this.subscription = this.user.ud.subscribe((ud) => {
            if (isInit) {
                return;
            }
            isInit = true;
            if (ud !== null) {
                this.findNew();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateRes(res: Res) {
        this.reses.set(this.reses.findIndex((r) => r.id === res.id), res);
    }

    private async findNew() {
        let ud=this.user.ud.getValue();
        try{
            this.reses = Immutable.List(await this.api.findResNoticeNew(ud.auth, {
                limit: this.limit
            }));
        }catch(_e){
            this.snackBar.open("レス取得に失敗");
        }
    }

    async readNew() {
        let ud=this.user.ud.getValue();
        try{
            if (this.reses.size === 0) {
                this.findNew();
            } else {
                this.reses = Immutable.List((await this.api.findResNotice(ud.auth,
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
        let ud=this.user.ud.getValue();
        try{
            if (this.reses.size === 0) {
                this.findNew();
            } else {
                this.reses = Immutable.List(this.reses.toArray().concat(await this.api.findResNotice(ud.auth,
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