import { Component, OnInit } from '@angular/core';
import {
    Msg,
    AtApiService,
} from 'anontown';
import { UserDataService } from '../services';

@Component({
    selector: 'at-user-msg',
    template: `
        <div *ngIf="ud.isToken|async" class="container">
            <button type="button" (click)="readNew()" class="btn btn-default">最新</button><br>
            <div class="panel-group">
                <div *ngFor="let m of msgs" class="panel panel-default">
                    <div class="panel-body" [innerHTML]="m.mdtext"></div>
                </div>
            </div>
            <button type="button" (click)="readOld()" class="btn btn-default">前</button><br>
        </div>
        <div *ngIf="ud.notToken|async" class="container">
            ログインしてください。
        </div>
    `,
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