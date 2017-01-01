import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, IUserData, IUserDataListener } from '../services';

import { Router } from '@angular/router';
import { Topic, AtApiService } from 'anontown';

import * as Immutable from 'immutable';

@Component({
    selector: 'at-user-favo-topic',
    templateUrl: './user-favo.component.html'
})
export class UserFavoTopicComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private router: Router,
        private api: AtApiService) {
    }

    favo: Immutable.List<Topic>;
    ud: IUserData = null;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(async ud => {
            if (ud !== null) {
                this.favo = Immutable.List(await this.api.findTopicIn({ ids: ud.storage.topicFavo.toArray() }));
                this.ud = ud;
            } else {
                this.ud = null;
                this.favo = null;
            }
        });
    }

    ngOnDestroy() {
        this.user.removeUserDataListener(this.udListener);
    }

    linkClick(id: number) {
        this.router.navigate(['/topic', id])
    }
}