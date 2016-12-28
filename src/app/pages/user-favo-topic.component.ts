import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services';

import { Router } from '@angular/router';
import { Topic } from 'anontown';


@Component({
    selector: 'at-user-favo-topic',
    templateUrl: './user-favo.component.html'
})
export class UserFavoTopicComponent implements OnInit {
    private ud: UserDataService;

    private favo: Topic[];

    constructor(ud: UserDataService,
        private router: Router) {
        this.ud = ud;
    }

    async ngOnInit() {
        this.favo = (await this.ud.storage).topicFav;
    }

    linkClick(id: number) {
        this.router.navigate(['/topic', id])
    }
}