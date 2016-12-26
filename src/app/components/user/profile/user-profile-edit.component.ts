import { Component, OnInit, Input } from '@angular/core';
import {
    AtApiService,
    Profile,
    AtError
} from 'anontown';
import { UserDataService } from '../../../services';

@Component({
    selector: 'at-user-profile-edit',
    template: `
        <div class="panel panel-default">
            <div class="panel-heading">
                <button type="button" class="btn-xs btn-default" (click)="edit()">
                    <span class="glyphicon glyphicon-edit"></span>
                </button>
                <a [routerLink]="['/profile',profile.id]">
                    ●{{profile.id}}
                </a>
            </div>
            <div class="panel-body">
                <form *ngIf="isEdit" (ngSubmit)="ok()">
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
    `,
})
export class UserProfileEditComponent extends OnInit {
    @Input()
    private profile: Profile;

    private isEdit = false;

    private name = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private ud: UserDataService,
        private api: AtApiService) {
        super();
    }

    ngOnInit() {
        this.name = this.profile.name;
        this.text = this.profile.text;
    }

    ok() {
        (async () => {
            let profile = await this.api.updateProfile(await this.ud.auth, {
                id: this.profile.id,
                name: this.name,
                text: this.text
            });
            this.errorMsg = null;

            //プロフィール更新
            let profiles = await this.ud.profiles;
            profiles[profiles.indexOf(this.profile)] = profile;
            this.profile = profile;
            this.ngOnInit();
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }

    edit() {
        this.isEdit = !this.isEdit;
    }
}