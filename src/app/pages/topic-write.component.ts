import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AtApiService,
    AtError
} from 'anontown';
import { UserService, IUserData, IUserDataListener } from '../services';
import { Router } from '@angular/router';


@Component({
    selector: 'at-topic-write',
    templateUrl: './topic-write.component.html'
})
export class TopicWriteComponent implements OnInit, OnDestroy {
    private title = "";
    private category = "";
    private text = "";
    private errorMsg: string | null = null;

    constructor(private user: UserService,
        private api: AtApiService,
        private router: Router) {
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

    write() {
        (async () => {
            let topic = await this.api.createTopic(this.ud.auth, {
                title: this.title,
                category: this.category.length === 0 ? [] : this.category.split("/"),
                text: this.text
            });
            this.errorMsg = null;
            this.router.navigate(["topic", topic.id]);
        })().catch(e => {
            if (e instanceof AtError) {
                this.errorMsg = e.message;
            } else {
                throw e;
            }
        });
    }
}

