import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
    AtApiService,
    AtError,
    TopicType
} from 'anontown';
import { UserService} from '../../services';
import { Router } from '@angular/router';


@Component({
    selector: 'app-topic-write',
    templateUrl: './topic-write.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TopicWriteComponent implements OnInit, OnDestroy {
    private title = "";
    private category = "";
    private text = "";
    private type: TopicType = "normal";
    private errorMsg: string | null = null;

    constructor(public user: UserService,
        private api: AtApiService,
        private router: Router) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    write() {
        (async () => {
            let topic = await this.api.createTopic(this.user.ud.auth, {
                title: this.title,
                category: this.category.length === 0 ? [] : this.category.split("/"),
                text: this.text,
                type: this.type
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

