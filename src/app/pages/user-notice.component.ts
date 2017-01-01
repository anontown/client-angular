import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    Res,
    AtApiService,
} from 'anontown';
import { UserService, IUserData, IUserDataListener } from '../services';
import * as Immutable from 'immutable';

@Component({
    selector: 'at-user-notice',
    templateUrl: './user-notice.component.html'
})
export class UserNoticeComponent implements OnInit, OnDestroy {
    private reses = Immutable.List<Res>();
    private limit = 50;

    constructor(
        private user: UserService,
        private api: AtApiService) {
    }

    ud: IUserData;
    private udListener: IUserDataListener;
    ngOnInit() {
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
            if (ud !== null) {
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
        this.reses = Immutable.List(await this.api.findResNoticeNew(this.ud.auth, {
            limit: this.limit
        }));
    }

    async readNew() {
        if (this.reses.size === 0) {
            this.findNew();
        } else {
            this.reses = Immutable.List((await this.api.findResNotice(this.ud.auth,
                {
                    type: "after",
                    equal: false,
                    date: this.reses.first().date,
                    limit: this.limit
                })).concat(this.reses.toArray()));
        }
    }

    async readOld() {
        if (this.reses.size === 0) {
            this.findNew();
        } else {
            this.reses = Immutable.List(this.reses.toArray().concat(await this.api.findResNotice(this.ud.auth,
                {
                    type: "before",
                    equal: false,
                    date: this.reses.last().date,
                    limit: this.limit
                })));
        }
    }
}