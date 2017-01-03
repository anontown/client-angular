import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UserService, IUserData, IUserDataListener } from '../../services';

import { Router } from '@angular/router';
import { Topic, AtApiService } from 'anontown';

import * as Immutable from 'immutable';

@Component({
    selector: 'app-user-favo-topic',
    templateUrl: './user-favo-topic.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class UserFavoTopicComponent implements OnInit, OnDestroy {
    constructor(private user: UserService,
        private router: Router,
        private api: AtApiService) {
    }

    favo: Immutable.List<Topic>;
    ud: IUserData;
    private udListener: IUserDataListener;

    ngOnInit() {
        this.udListener = this.user.addUserDataListener(async ud => {
            if (ud !== null) {
                this.ud = ud;
                await this.update();
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

    private async update() {
        this.favo = Immutable.List(await this.api.findTopicIn({ ids: this.ud.storage.topicFavo.toArray() }))
            .sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0).toList();
    }
}