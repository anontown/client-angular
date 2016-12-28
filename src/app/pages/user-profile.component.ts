import { Component } from '@angular/core';

import { UserDataService } from '../services';

@Component({
    selector: 'at-user-profile',
    templateUrl: './user-profile.component.html'
})
export class UserProfileComponent {
    private ud: UserDataService;
    constructor(
        ud: UserDataService
    ) {
        this.ud = ud;
    }
}