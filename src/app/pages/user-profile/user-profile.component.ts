import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { UserService, IUserData, IUserDataListener } from '../../services';
import { Profile } from 'anontown';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileComponent implements OnInit, OnDestroy {
    constructor(private user: UserService) {
    }

    ud: IUserData;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    update(pr: Profile) {
        this.user.setUserData({
            auth: this.ud.auth,
            token: this.ud.token,
            storage: this.ud.storage,
            profiles: this.ud.profiles.set(this.ud.profiles.findIndex(p => p.id === pr.id), pr)
        })
    }

    add(p: Profile) {
        this.user.setUserData({
            auth: this.ud.auth,
            token: this.ud.token,
            storage: this.ud.storage,
            profiles: this.ud.profiles.push(p)
        })
    }
}