import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
    Msg,
    AtApiService,
} from 'anontown';
import { UserService } from '../../services';
import * as Immutable from 'immutable';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
    templateUrl: './user-msg.page.component.html',
    styleUrls: ['./user-msg.page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserMsgPageComponent implements OnInit, OnDestroy {
    private msgs = Immutable.List<Msg>();
    private limit = 50;

    constructor(
        public user: UserService,
        private api: AtApiService,
        public snackBar: MdSnackBar) {
    }

    private subscription: Subscription;

    ngOnInit() {
        document.title = "お知らせ"
        this.subscription = this.user.ud.subscribe((ud) => {
            if (ud !== null) {
                this.findNew();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private async findNew() {
        let ud = this.user.ud.getValue();
        try {
            this.msgs = Immutable.List(await this.api.findMsgNew(ud.auth,
                {
                    limit: this.limit
                }));
        } catch (_e) {
            this.snackBar.open("メッセージ取得に失敗");
        }
    }

    async readNew() {
        let ud = this.user.ud.getValue();
        try {
            if (this.msgs.size === 0) {
                this.findNew();
            } else {
                this.msgs = Immutable.List((await this.api.findMsg(ud.auth,
                    {
                        type: "after",
                        equal: false,
                        date: this.msgs.first().date,
                        limit: this.limit
                    })).concat(this.msgs.toArray()));
            }
        } catch (_e) {
            this.snackBar.open("メッセージ取得に失敗");
        }
    }

    async readOld() {
        let ud = this.user.ud.getValue();
        try {
            if (this.msgs.size === 0) {
                this.findNew();
            } else {
                this.msgs = Immutable.List(this.msgs.toArray().concat(await this.api.findMsg(ud.auth,
                    {
                        type: "before",
                        equal: false,
                        date: this.msgs.last().date,
                        limit: this.limit
                    })));
            }
        } catch (_e) {
            this.snackBar.open("メッセージ取得に失敗");
        }
    }
}