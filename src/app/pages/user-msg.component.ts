import { Component, OnInit } from '@angular/core';
import {
    Msg,
    AtApiService,
} from 'anontown';
import { UserDataService } from '../services';

@Component({
    selector: 'at-user-msg',
    templateUrl: './user-msg.component.html'
})
export class UserMsgComponent implements OnInit {
    private msgs: Msg[] = [];
    private limit = 50;

    constructor(
        private ud: UserDataService,
        private api: AtApiService) {
    }

    private async findNew() {
        this.msgs = await this.api.findMsgNew(await this.ud.auth,
            {
                limit: this.limit
            })

    }

    ngOnInit() {
        this.findNew();
    }

    async readNew() {
        if (this.msgs.length === 0) {
            this.findNew();
        } else {
            this.msgs = (await this.api.findMsg(await this.ud.auth,
                {
                    type: "after",
                    equal: false,
                    date: this.msgs[0].date,
                    limit: this.limit
                })).concat(this.msgs);
        }
    }

    async readOld() {
        if (this.msgs.length === 0) {
            this.findNew();
        } else {
            this.msgs = this.msgs.concat(await this.api.findMsg(await this.ud.auth,
                {
                    type: "before",
                    equal: false,
                    date: this.msgs[this.msgs.length - 1].date,
                    limit: this.limit
                }));
        }
    }
}