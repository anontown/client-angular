import { Component, OnInit, OnDestroy,ChangeDetectionStrategy } from '@angular/core';
import {
    Msg,
    AtApiService,
} from 'anontown';
import { UserService, IUserData, IUserDataListener } from '../../services';
import * as Immutable from 'immutable';

@Component({
    selector: 'app-user-msg',
    templateUrl: './user-msg.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserMsgComponent implements OnInit, OnDestroy {
    private msgs = Immutable.List<Msg>();
    private limit = 50;

    constructor(
        private user: UserService,
        private api: AtApiService) {
    }

    ud: IUserData;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.user.addUserDataListener(ud => {
            this.ud = ud;
            if (ud !== null) {
                this.findNew();
            }
        })
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    private async findNew() {
        this.msgs = Immutable.List(await this.api.findMsgNew(this.ud.auth,
            {
                limit: this.limit
            }));
    }

    async readNew() {
        if (this.msgs.size === 0) {
            this.findNew();
        } else {
            this.msgs = Immutable.List((await this.api.findMsg(this.ud.auth,
                {
                    type: "after",
                    equal: false,
                    date: this.msgs.first().date,
                    limit: this.limit
                })).concat(this.msgs.toArray()));
        }
    }

    async readOld() {
        if (this.msgs.size === 0) {
            this.findNew();
        } else {
            this.msgs = Immutable.List(this.msgs.toArray().concat(await this.api.findMsg(this.ud.auth,
                {
                    type: "before",
                    equal: false,
                    date: this.msgs.last().date,
                    limit: this.limit
                })));
        }
    }
}