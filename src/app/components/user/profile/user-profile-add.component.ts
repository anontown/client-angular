import { Component } from '@angular/core';
import {
    AtApiService,
    AtError
} from 'anontown';
import { UserDataService } from '../../../services';


@Component({
    selector: 'at-user-profile-add',
    template: `
        <div *ngIf="ud.isToken|async" class="panel panel-default">
            <div class="panel-body">
                <form (ngSubmit)="ok()">
                    <div class="alert alert-danger" *ngIf="errorMsg!==null">
                        <span class="glyphicon glyphicon-exclamation-sign"></span>
                        {{errorMsg}}
                    </div>
                    <div class="form-group">
                        <label>名前</label>
                        <input type="text" class="form-control" [(ngModel)]="name" name="name">
                    </div>
                    <div class="form-group">
                        <label>本文</label>
                        <textarea class="form-control" [(ngModel)]="text" name="text"></textarea>
                        <div [innerHTML]="text|md" class="well"></div>
                    </div>
                    <button type="submit" class="btn btn-default">OK</button>
                </form>
            </div>
        </div>
        <div *ngIf="ud.notToken|async">
            ログインしないとプロフィール管理は出来ません
        </div>
    `,
})
export class UserProfileAddComponent {
    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService, private api: AtApiService) {
    }

    ok() {
        (async () => {
            let p = await this.api.createProfile(await this.ud.auth, {
                name: this.name,
                text: this.text
            });
            (await this.ud.profiles).push(p);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });

    }
}