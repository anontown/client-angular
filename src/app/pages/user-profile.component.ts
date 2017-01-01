import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserService, IUserData, IUserDataListener } from '../services';

@Component({
    selector: 'at-user-profile',
    templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit, OnDestroy {
    constructor(private user: UserService) {
    }

    ud: IUserData = null;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(ud => {
            this.ud = ud;
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }
}