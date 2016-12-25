import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    AtApiService,
    Res,
    Topic,
    AtError
} from 'anontown';

import { UserDataService } from '../services';

@Component({
    selector: 'at-res-write',
    template: `
    <div class="panel panel-default" *ngIf="ud.isToken|async">
        <div class="panel-body">
            <form (ngSubmit)="ok()">
                <div class="alert alert-danger" *ngIf="errorMsg!==null">
                    <span class="glyphicon glyphicon-exclamation-sign"></span>
                    {{errorMsg}}
                </div>
                <div class="form-inline">
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" class="form-control" [(ngModel)]="name" name="name">
                    </div>
                    <div class="form-group">
                        <label>プロフ</label>
                        <select [(ngModel)]="profile" class="form-control" name="profile">
                            <option [value]="0" selected>なし</option>
                            <option *ngFor="let p of ud.profiles|async" [value]="p.id">●{{p.id}} {{p.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>本文</label>
                    <textarea [(ngModel)]="text" class="form-control" name="text"></textarea>
                    <div [innerHTML]="text|md" class="well"></div>
                </div>
                <button type="submit" class="btn btn-default">書き込む</button>
            </form>
        </div>
    </div>
    <div  *ngIf="ud.notToken|async">
        ログインしないと書き込めません
    </div>
    `,
})
export class ResWriteComponent {
    private name = "";
    private text = "";
    private profile: string | null = null;;
    private errorMsg: string | null = null;
    @Output()
    write = new EventEmitter<Res>();

    constructor(private ud: UserDataService,
        private api: AtApiService) {
    }

    @Input()
    private topic: Topic | string;

    @Input()
    private reply: Res | null = null;

    ok() {
        (async () => {
            let res = await this.api.createRes(await this.ud.auth, {
                topic: typeof this.topic === "string" ? this.topic : this.topic.id,
                name: this.name,
                text: this.text,
                reply: this.reply !== null ? this.reply.id : null,
                profile: this.profile
            });

            this.text = "";
            this.reply = null;
            this.errorMsg = null;
            this.write.emit(res);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }
}