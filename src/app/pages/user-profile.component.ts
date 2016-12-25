import { Component } from '@angular/core';

import { UserDataService } from '../services';

@Component({
    selector: 'at-user-profile',
    template: `
        <div *ngIf="ud.isToken|async" class="container">
            <at-user-profile-add></at-user-profile-add>
            <div class="panel-group">
                <at-user-profile-edit *ngFor="let p of ud.profiles|async" [profile]="p"></at-user-profile-edit>
            </div>
        </div>
        <div *ngIf="ud.notToken|async" class="container">
            ログインしてください。
        </div>
    `,
})
export class UserProfileComponent {
    private ud: UserDataService;
    constructor(
        ud: UserDataService
    ) {
        this.ud = ud;
    }
}