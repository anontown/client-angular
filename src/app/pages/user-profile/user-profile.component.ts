import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { UserService } from '../../services';
import { Profile } from 'anontown';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileComponent implements OnInit, OnDestroy {
    constructor(private user: UserService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    update(pr: Profile) {
        this.user.setUserData({
            auth: this.user.ud.auth,
            token: this.user.ud.token,
            storage: this.user.ud.storage,
            profiles: this.user.ud.profiles.set(this.user.ud.profiles.findIndex(p => p.id === pr.id), pr)
        })
    }

    add(p: Profile) {
        this.user.setUserData({
            auth: this.user.ud.auth,
            token: this.user.ud.token,
            storage: this.user.ud.storage,
            profiles: this.user.ud.profiles.push(p)
        })
    }
}