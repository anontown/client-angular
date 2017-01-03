import { Component, OnInit, OnDestroy,ChangeDetectionStrategy } from '@angular/core';

import { UserService, IUserData, IUserDataListener } from '../../services';

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
}